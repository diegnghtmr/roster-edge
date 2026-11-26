package co.edu.uniquindio.rosteredge.backend.config;

import co.edu.uniquindio.rosteredge.backend.exception.GlobalExceptionHandler;
import co.edu.uniquindio.rosteredge.backend.model.Staff;
import co.edu.uniquindio.rosteredge.backend.security.ClubScopeDeniedException;
import co.edu.uniquindio.rosteredge.backend.security.RosterAuthenticationFilter;
import co.edu.uniquindio.rosteredge.backend.security.RosterAuthorization;
import co.edu.uniquindio.rosteredge.backend.service.RosterService;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.List;

@Configuration
public class RosterSecurityConfig implements WebMvcConfigurer {

    private final RosterAuthorization authorization;
    private final GlobalExceptionHandler apiErrors;
    private final ObjectMapper json;

    public RosterSecurityConfig(RosterAuthorization authorization, GlobalExceptionHandler apiErrors, ObjectMapper json) {
        this.authorization = authorization;
        this.apiErrors = apiErrors;
        this.json = json;
    }

    @Bean
    FilterRegistrationBean<RosterAuthenticationFilter> rosterAuthenticationFilter(
            RosterService rosters, @Qualifier("handlerExceptionResolver") HandlerExceptionResolver errors) {
        var registration = new FilterRegistrationBean<>(new RosterAuthenticationFilter(rosters, errors));
        registration.setOrder(Integer.MAX_VALUE);
        return registration;
    }

    @Override
    public void extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers) {
        // Controller-local generic exception handlers must not turn policy denials into 500s.
        resolvers.addFirst((request, response, handler, exception) -> {
            if (!(exception instanceof ClubScopeDeniedException denied)) {
                return null;
            }
            var error = apiErrors.handleEntityNotFoundException(denied);
            response.setStatus(error.getStatusCode().value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            try {
                json.writeValue(response.getOutputStream(), error.getBody());
            } catch (IOException ex) {
                throw new UncheckedIOException(ex);
            }
            return new ModelAndView();
        });
    }

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        // The legacy Staff request still calls its raw password field passwordHash.
        converters.stream().filter(MappingJackson2HttpMessageConverter.class::isInstance)
                .map(MappingJackson2HttpMessageConverter.class::cast)
                .forEach(converter -> converter.getObjectMapper().addMixIn(Staff.class, StaffCredentialMixin.class));
    }

    private abstract static class StaffCredentialMixin {
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        abstract String getPasswordHash();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authorization);
    }
}

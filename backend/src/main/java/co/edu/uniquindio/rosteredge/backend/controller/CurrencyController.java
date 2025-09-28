package co.edu.uniquindio.rosteredge.backend.controller;

import co.edu.uniquindio.rosteredge.backend.model.Currency;
import co.edu.uniquindio.rosteredge.backend.service.CurrencyService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/currencies")
public class CurrencyController extends SimpleCrudController<Currency> {

    public CurrencyController(CurrencyService service) {
        super(service);
    }
}


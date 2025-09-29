package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Currency;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CurrencyRepository extends BaseRepository<Currency, Long> {

    @Query("SELECT * FROM \"Currency\" WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:symbol IS NULL OR LOWER(symbol) LIKE LOWER(CONCAT('%', :symbol, '%'))) " +
           "AND (:active IS NULL OR active = :active)")
    List<Currency> findByFilters(@Param("name") String name,
                                 @Param("symbol") String symbol,
                                 @Param("active") Boolean active);
}


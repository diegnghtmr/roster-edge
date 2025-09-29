package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.StaffRole;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRoleRepository extends BaseRepository<StaffRole, Long> {

    @Query("SELECT * FROM \"StaffRole\" WHERE (:name IS NULL OR LOWER(name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:active IS NULL OR active = :active)")
    List<StaffRole> findByFilters(@Param("name") String name,
                                  @Param("active") Boolean active);
}


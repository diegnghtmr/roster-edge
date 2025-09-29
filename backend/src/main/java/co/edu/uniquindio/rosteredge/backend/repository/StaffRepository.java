package co.edu.uniquindio.rosteredge.backend.repository;

import co.edu.uniquindio.rosteredge.backend.model.Staff;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends BaseRepository<Staff, Long> {

    @Query("SELECT * FROM \"Staff\" WHERE (:teamId IS NULL OR team_id = :teamId) " +
           "AND (:staffRoleId IS NULL OR staff_role_id = :staffRoleId) " +
           "AND (:active IS NULL OR active = :active)")
    List<Staff> findByFilters(@Param("teamId") Long teamId,
                              @Param("staffRoleId") Long staffRoleId,
                              @Param("active") Boolean active);
}


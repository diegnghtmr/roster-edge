package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Color;
import co.edu.uniquindio.rosteredge.backend.repository.ColorRepository;
import co.edu.uniquindio.rosteredge.backend.service.ColorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ColorServiceImpl extends SimpleCrudService<Color> implements ColorService {

    private final ColorRepository colorRepository;

    public ColorServiceImpl(ColorRepository repository) {
        super(repository);
        this.colorRepository = repository;
    }

    @Override
    protected String getEntityName() {
        return "Color";
    }

    @Override
    @Transactional(readOnly = true)
    public List<Color> findByFilters(String name, Boolean active) {
        return colorRepository.findByFilters(name, active);
    }
}



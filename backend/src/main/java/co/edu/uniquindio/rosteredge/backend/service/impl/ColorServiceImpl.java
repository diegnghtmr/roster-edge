package co.edu.uniquindio.rosteredge.backend.service.impl;

import co.edu.uniquindio.rosteredge.backend.model.Color;
import co.edu.uniquindio.rosteredge.backend.repository.ColorRepository;
import co.edu.uniquindio.rosteredge.backend.service.ColorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ColorServiceImpl extends SimpleCrudService<Color> implements ColorService {

    public ColorServiceImpl(ColorRepository repository) {
        super(repository);
    }

    @Override
    protected String getEntityName() {
        return "Color";
    }
}



package com.ana.bookapi.service.book;

import com.ana.bookapi.models.Genre;
import com.ana.bookapi.repository.GenreRepo;
import org.springframework.stereotype.Service;

@Service
public class GenreService {
    private final GenreRepo gr;
    public GenreService(GenreRepo genreRepo) {
        this.gr = genreRepo;
    }
    public Genre getGenre(String id){
        if (!gr.existsById(id)) {
            throw new RuntimeException ("Genre not found");
        }
        return gr.findById(id).get();
    }
}

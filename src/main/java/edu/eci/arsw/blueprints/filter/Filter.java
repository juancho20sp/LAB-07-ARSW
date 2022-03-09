package edu.eci.arsw.blueprints.filter;

import edu.eci.arsw.blueprints.model.Blueprint;

import java.util.Set;

public interface Filter {
    public Blueprint blueprintFilter(Blueprint blueprint);

    public Set<Blueprint> blueprintsFilter(Set<Blueprint> blueprints);
}

package edu.eci.arsw.blueprints.filter;

import edu.eci.arsw.blueprints.filter.Filter;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@Qualifier("Sumbsampling")
public class SubsamplingFilter implements Filter {
    @Override
    public Blueprint blueprintFilter(Blueprint blueprint) {
        List<Point> points = blueprint.getPoints();
        List<Point> filteredList = new ArrayList<>();

        for( int index = 0; index < points.size() - 1; index++ ){
            if( index % 2 == 0 ){
                filteredList.add(points.get(index));
            }
        }
        blueprint.setPoints(filteredList);
        return blueprint;
    }

    @Override
    public Set<Blueprint> blueprintsFilter(Set<Blueprint> blueprints) {
        blueprints.forEach( blueprint -> {
            blueprintFilter( blueprint );
        });
        return blueprints;
    }
}
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.persistence.impl;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 *
 * @author hcadavid
 */

@Service
public class InMemoryBlueprintPersistence implements BlueprintsPersistence{

    private final ConcurrentHashMap<Tuple<String,String>,Blueprint> blueprints=new ConcurrentHashMap<>();

    public InMemoryBlueprintPersistence() {
        //load stub data
        loadNewData();

    }

    public void loadNewData(){
        for(int i = 1; i <= 4; i++){
            Point[] pts = new Point[]{new Point(140*i, 140*i), new Point(140*i, 140*i), new Point(115*i, 115+i)};
            int auth = (i%2 == 0) ? 1:2;
            Blueprint bp = new Blueprint("authorName"+auth, "bpName "+ i,pts);
            blueprints.put(new Tuple <>(bp.getAuthor(), bp.getName()), bp);
        }
        Blueprint bp = new Blueprint("juan", "bpName", new Point[]{new Point(140,14), new Point(14, 14), new Point(11, 15)});
        blueprints.put(new Tuple <>(bp.getAuthor(), bp.getName()), bp);
    }

    @Override
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException {
        if (blueprints.containsKey(new Tuple<>(bp.getAuthor(),bp.getName()))){
            throw new BlueprintPersistenceException("The given blueprint already exists: "+bp);
        }
        else{
            blueprints.put(new Tuple<>(bp.getAuthor(),bp.getName()), bp);
        }
    }

    @Override
    public Blueprint getBlueprint(String author, String bprintname) throws BlueprintNotFoundException {
        Blueprint blueprint = blueprints.get(new Tuple<>(author, bprintname));

        if (blueprint == null) {
            throw new BlueprintNotFoundException("The given blueprint does not exists.");
        }

        return blueprint;
    }

    @Override
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintPersistenceException {
        Set<Blueprint> myBlueprints = new HashSet<>();

        for(Tuple tuple : blueprints.keySet()){
            if (tuple.getElem1().equals(author)) {
                myBlueprints.add(blueprints.get(tuple));
            }
        }

        if (myBlueprints.size() == 0){
            throw new BlueprintPersistenceException("No existe el autor");
        }

        return myBlueprints;

    }

    @Override
    public Set<Blueprint> getAllBlueprints() throws BlueprintPersistenceException {
        Set<Blueprint> myBlueprints = new HashSet<>();

        for(Tuple tuple : blueprints.keySet()){
            myBlueprints.add(blueprints.get(tuple));
        }

        return myBlueprints;
    }
}

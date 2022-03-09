/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.controllers;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.services.BlueprintsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping(value = "/blueprints")
public class BlueprintAPIController {
    // Injection
    @Autowired
    BlueprintsServices services;

    //****************************GET METHODS*************************************************
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getAllBluePrints() {
        try {
            //obtener datos que se enviarán a través del API
            Set<Blueprint> data = services.getAllBlueprints();
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error inesperado", HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping( value = "/{author}" , method=RequestMethod.GET)
    public ResponseEntity<?> getByAuthor(@PathVariable("author") String author){
        try {
            //obtener datos que se enviarán a través del API
            Set<Blueprint> data = services.getBlueprintsByAuthor(author);
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            System.out.println("Catch Exception");
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No existe el autor mencionado",HttpStatus.valueOf(404));
        }
    }

    @RequestMapping( value = "/{author}/{bpName}" , method=RequestMethod.GET)
    public ResponseEntity<?> getByAuthorBPname(@PathVariable("author") String author, @PathVariable("bpName") String bpName){
        try {
            //obtener datos que se enviarán a través del API
            Blueprint data = services.getBlueprint(author, bpName);
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No existe el autor "+author+" cuyo plano se llame "+bpName,HttpStatus.valueOf(404));
        }
    }

    //curl -i -X POST -HContent-Type:application/json -HAccept:application/json http://localhost:8080/blueprints/add -d '{"author":"Val","points":[{"x":140,"y":14},{"x":14,"y":14},{"x":11,"y":15}],"name":"bpName"}'
    @RequestMapping(value = "/add",method = RequestMethod.POST, consumes = "application/json")
    @ResponseBody
    public ResponseEntity<?> addBP(@RequestBody Blueprint blueprint){
        try {
            services.addNewBlueprint(blueprint);

            return new ResponseEntity<>(HttpStatus.CREATED.getReasonPhrase() , HttpStatus.CREATED);
        } catch (Exception ex) {
            ex.printStackTrace();
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(HttpStatus.CREATED.getReasonPhrase(),HttpStatus.FORBIDDEN);
        }
    }

    //curl -i -X PUT -HContent-Type:application/json -HAccept:application/json http://localhost:8080/blueprints/juan/bpName -d '{"author":"Val","points":[{"x":25,"y":25},{"x":27,"y":27},{"x":28,"y":28}],"name":"bpName"}'
    @RequestMapping(value = "/{author}/{name}",method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> modifyBP(@RequestBody Blueprint blueprint,@PathVariable("author") String author, @PathVariable("name") String name){
        try {
            Blueprint bpEdit = services.getBlueprint(author, name);
            System.out.println(blueprint);
            bpEdit.setPoints(blueprint.getPoints());

            return new ResponseEntity<>( services.getBlueprint(author, name), HttpStatus.CREATED);
        } catch (Exception ex) {
            ex.printStackTrace();
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(HttpStatus.CREATED.getReasonPhrase(),HttpStatus.FORBIDDEN);
        }
    }
}


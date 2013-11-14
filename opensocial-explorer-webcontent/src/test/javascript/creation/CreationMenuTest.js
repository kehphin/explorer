/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
define(['explorer/widgets/creation/CreationMenu', 'dojo/dom-class', 'dojo/topic', 'dojo/dom-style'], 
        function(CreationMenu, domClass, topic, domStyle){
  describe('An CreationMenu widget', function() {
  
    beforeEach(function() {
      var div = document.createElement("div");
      div.style.display = 'none';
      div.id = 'testDiv';
      document.body.appendChild(div);
    });
  
    afterEach(function() {
      document.body.removeChild(document.getElementById('testDiv'));
    });
    
    it("is visible only when the user is logged in", function() {
      var creationMenu = new CreationMenu();
      document.getElementById('testDiv').appendChild(creationMenu.domNode);
      expect(domStyle.get(creationMenu.domNode, "display")).toBe("none");
      
      topic.publish("updateToken");
      expect(domStyle.get(creationMenu.domNode, "display")).toBe("block");
      
      creationMenu.destroy();
    }); 
     
    it("opens the new spec modal when the new spec button is toggled", function() {
      var creationMenu = new CreationMenu();
      document.getElementById('testDiv').appendChild(creationMenu.domNode);
      
      spyOn(creationMenu, "publishToggleCreationSpecModal");
      creationMenu.addGadgetButton.click();
      
      expect(creationMenu.publishToggleCreationSpecModal).toHaveBeenCalled();
      
      creationMenu.destroy();
    }); 
    
    it("opens the services modal when the service button is toggled", function() {
      var creationMenu = new CreationMenu();
      document.getElementById('testDiv').appendChild(creationMenu.domNode);
      
      spyOn(creationMenu, "publishToggleCreationSpecModal");
      creationMenu.addServiceButton.click();
      
      expect(domClass.contains(creationMenu.serviceModal, "hide")).toBe(false);
      
      creationMenu.destroy();
    });  
  });
});
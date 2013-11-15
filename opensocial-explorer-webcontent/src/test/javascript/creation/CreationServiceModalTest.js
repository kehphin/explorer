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
define(['explorer/widgets/creation/CreationServiceModal', 'explorer/widgets/creation/CreationMenu', 
        'dojo/topic', 'dojo/dom-class', 'dojo/dom-style'], 
        function(CreationServiceModal, CreationMenu, topic, domClass, domStyle){
  describe('An CreationServiceModal widget', function() {
    
    beforeEach(function() {
      var div = document.createElement("div");
      div.style.display = 'none';
      div.id = 'testDiv';
      document.body.appendChild(div);
    });
  
    afterEach(function() {
      document.body.removeChild(document.getElementById('testDiv'));
    });
    
    it("can be shown", function() {
      var creationMenu = new CreationMenu();
      document.getElementById('testDiv').appendChild(creationMenu.domNode);
      
      creationMenu.addServiceButton.click();
      
      expect(domClass.contains(creationMenu.serviceModal.domNode), "hide").toBe(false);
      
      creationMenu.destroy();
    }); 
    
    it("can fetch existing services with no data", function() {
      var creationServiceModal = new CreationServiceModal();
      document.getElementById('testDiv').appendChild(creationServiceModal.domNode);
      
      spyOn(creationServiceModal, "getServicesService").andReturn({
        getServices: function(token, callbacks) {
          var data = [];
          callbacks.success(data);
        }
      });
      
      creationServiceModal.show();
      
      expect(creationServiceModal.getServicesService).toHaveBeenCalled();
      expect(domStyle.get(creationServiceModal.noServices, "display")).toBe("block");
      expect(domStyle.get(creationServiceModal.oAuth, "display")).toBe("none");      
      
      creationServiceModal.destroy();
    });
    
    it("can fetch existing services with data", function() {
      var testData = {
          name: "testName",
          key: "testKey",
          secret: "testSecret",
          keyType: "testKeyType",
          callbackUrl : "testCallbackUrl"
      }
      
      var creationServiceModal = new CreationServiceModal();
      document.getElementById('testDiv').appendChild(creationServiceModal.domNode);
      
      spyOn(creationServiceModal, "addServiceItem");
      spyOn(creationServiceModal, "getServicesService").andReturn({
        getServices: function(token, callbacks) {
          var data = [testData];
          callbacks.success(data);
        }
      });
      
      creationServiceModal.show();
      
      expect(creationServiceModal.getServicesService).toHaveBeenCalled();
      expect(domStyle.get(creationServiceModal.noServices, "display")).toBe("none");
      expect(domStyle.get(creationServiceModal.oAuth, "display")).toBe("block");
      expect(creationServiceModal.addServiceItem).toHaveBeenCalledWith(testData);
      
      creationServiceModal.destroy();
    });
    
    it("can create a new service and display the services tab afterwards", function() {
      var testData = {
          version: "OAuth",
          st: "testSt",
          name: "",
          key: "",
          secret: "",
          keyType: "HMAC_SYMMETRIC",
          callbackUrl : "%origin%%contextRoot%/gadgets/oauthcallback"
      }
      
      var creationServiceModal = new CreationServiceModal();
      document.getElementById('testDiv').appendChild(creationServiceModal.domNode);
      
      spyOn(creationServiceModal, "getToken").andReturn("testSt");
      spyOn(creationServiceModal, "addServiceItem");
      spyOn(creationServiceModal, "getServicesService").andReturn({
        createNewService: function(oAuth, callbacks) {
          var data = [oAuth];
          callbacks.success(data);
        }
      });
      
      creationServiceModal.toggleTab();
      creationServiceModal.serviceSubmit.click();
      
      expect(creationServiceModal.addServiceItem).toHaveBeenCalledWith(testData);
      expect(domClass.contains(creationServiceModal.servicesTab, "active")).toBe(true);
      
      creationServiceModal.destroy();
    });
    
    it("changes its content when a different oAuth selection in the dropdown is toggled", function() {
      var testData = {
          version: "OAuth",
          st: "testSt",
          name: "",
          key: "",
          secret: "",
          keyType: "HMAC_SYMMETRIC",
          callbackUrl : "%origin%%contextRoot%/gadgets/oauthcallback"
      }
      
      var creationServiceModal = new CreationServiceModal();
      document.getElementById('testDiv').appendChild(creationServiceModal.domNode);
      
      spyOn(creationServiceModal, "clearContent").andCallThrough();
      
      creationServiceModal.serviceSelection.value = "OAuth2";
      
      expect(domClass.contains(creationServiceModal.oAuthGeneralContent, "active")).toBe(true);
      
      creationServiceModal.dropdownClickHandler();
      
      expect(creationServiceModal.clearContent).toHaveBeenCalled(); 
      expect(domClass.contains(creationServiceModal.generalPill, "active")).toBe(true);
      expect(domClass.contains(creationServiceModal.advancedPill, "active")).toBe(false);
      expect(domClass.contains(creationServiceModal.oAuth2GeneralContent, "active")).toBe(true); 
      expect(domClass.contains(creationServiceModal.oAuthGeneralContent, "active")).toBe(false);
      
      creationServiceModal.destroy();
    });
  });
});
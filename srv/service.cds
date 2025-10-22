using {cap.incident as my } from '../db/schema';
/**
 * Service used by support personell, i.e. the incidents' 'processors'.


    action insertIncident returns String;
 /**
* Used by support team members to process incidents
*/
service ProcessorService { 


    entity Incidents as projection on my.Incidents;
 

    @readonly
    entity Customers as projection on my.Customers;
       entity Addresses as projection on my.Addresses;
}


annotate ProcessorService.Incidents with @odata.draft.enabled;
annotate ProcessorService with @(requires: 'support') ;




/**
 * Service used by administrators to manage customers and incidents.
 */
service AdminService {
    entity Customers as projection on my.Customers;
    entity Incidents as projection on my.Incidents;
    }

    annotate AdminService with @(requires: 'admin') ;
    


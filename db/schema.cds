namespace cap.incident;
using { managed,cuid, sap.common.CodeList } from '@sap/cds/common';


 ///managed : This entity automatically gets audit fields that track who created and who last updated a record, and when

/**
* Incidents created by Customers.
*/
entity Incidents : cuid, managed {  
customer     : Association to Customers;
title        : String  @title : 'Title';
urgency        : Association to Urgency default 'M';  //Priority level, default Medium
status         : Association to Status default 'N';   // // Current status, default New
conversation  : Composition of many {
    key ID    : UUID;
    timestamp : type of managed:createdAt;      // Auto-filled creation timestamp
    author    : type of managed:createdBy;     // Auto-filled user who added the message
    message   : String;                       // Actual message text

};

}

/**
* Customers entitled to create support Incidents.
*/
entity Customers : managed { 
key ID        : String;
firstName     : String;
lastName      : String;
name          : String = trim(firstName ||' '|| lastName); //combines first and last names, removing extra spaces.
email         : EMailAddress;
phone         : PhoneNumber;
incidents     : Association to many Incidents on incidents.customer = $self;
creditCardNo  : String(16) @assert.format: '^[1-9]\d{15}$'; // Must be exactly 16 digits and cannot start with 0
addresses     : Composition of many Addresses on addresses.customer = $self;
}

entity Addresses : cuid, managed {
customer      : Association to Customers;
city          : String;
postCode      : String;
streetAddress : String;
}


entity Status : CodeList {
key code: String enum {
    new = 'N';
    assigned = 'A'; 
    in_process = 'I'; 
    on_hold = 'H'; 
    resolved = 'R'; 
    closed = 'C'; 
};
criticality : Integer;
}

entity Urgency : CodeList {
key code: String enum {
    high = 'H';
    medium = 'M'; 
    low = 'L'; 
};
}

type EMailAddress : String;
type PhoneNumber : String;
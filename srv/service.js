const cds = require('@sap/cds')
const { SELECT } = require('@sap/cds/lib/ql/cds-ql')


module.exports = class ProcessorService extends cds.ApplicationService { init() {

  // const { Incidents, Customers } = cds.entities('ProcessorService')

  const {Incidents, Customers} = this.entities

  this.before ('CREATE', Incidents,this.ChangeUrgencyDueToSubject)
  this.before('CREATE',Incidents, this.onValidation) 
  this.before('CREATE',Incidents,this.AutoFillMessage)

  this.before('UPDATE',Incidents , async (req) => this.onUpdate(req))
  
  this.after ('READ', Incidents, async (incidents, req) => {
    console.log('After READ Incidents', incidents)
  })
  this.before (['CREATE', 'UPDATE'], Customers, async (req) => {
    console.log('Before CREATE/UPDATE Customers', req.data)
  })
  this.after ('READ', Customers, async (customers, req) => {
    console.log('After READ Customers', customers)
  })
  this.after('READ', Incidents, incidents => {
  const items = Array.isArray(incidents) ? incidents : [incidents]
  for (const incident of items) {
    incident.isEditable = incident.status_code !== 'C' // editable only if NOT closed
  }
})



  return super.init()

}
  ChangeUrgencyDueToSubject(req){

   let urgent = req.data.title?.match(/urgent/i)
   console.log('urgent:', urgent)
   if(urgent) req.data.urgency_code = 'H'

//   if (typeof req.data.title === 'string' && req.data.title.toLowerCase().includes('urgent')) {
//   data.urgency_code = 'H';
// }
    
  }


  async onUpdate(req){
    console.log('req.subject:',req.subject)

    let closed = await SELECT.one .from(req.subject) .where `status_code = 'C'`
  

    console.log('Closed :', closed)
    if(closed) req.reject `Can't modify a closed Incident`


  }
    onValidation(req){

    console.log( 'val req.data' ,req.data)
    const {title, status_code} = req.data;
    console.log("Status", status_code)

    if(!title ){
      req.reject("Please Enter the Title")

      return
    }

    if(status_code !== 'N'){
      req.reject("During Creation, Status Should be New")
      return
    }
   
    
  }
  // AutoFill Message with default
  AutoFillMessage(req){


  
    if(!req.data.conversation){
      req.data.conversation = []
    }
    req.data.conversation.push({
      message : ' New Incident Created  '
    })
  }


}

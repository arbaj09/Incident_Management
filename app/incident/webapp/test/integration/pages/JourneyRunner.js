sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ns/incident/test/integration/pages/IncidentsList",
	"ns/incident/test/integration/pages/IncidentsObjectPage"
], function (JourneyRunner, IncidentsList, IncidentsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ns/incident') + '/test/flp.html#app-preview',
        pages: {
			onTheIncidentsList: IncidentsList,
			onTheIncidentsObjectPage: IncidentsObjectPage
        },
        async: true
    });

    return runner;
});


public class OrgInformationRest {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getLimits(){

        Map<String, Object> limits = new Map<String, Object>();

        HttpRequest request = new HttpRequest();
        request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
        request.setEndpoint(URL.getSalesforceBaseUrl().toExternalForm() + '/services/data/v53.0/limits'); //keep version dynamic
        request.setMethod('GET');

        Http http = new Http();
        HttpResponse response = new HttpResponse();

        try{
            response = http.send(request);
            limits = response.getStatusCode() == 200 ? (Map<String, Object>) JSON.deserializeUntyped(response.getBody()) : null;
        }catch(Exception e){
            response.setBody(e.getMessage());
        }

        return limits;
    } 

}
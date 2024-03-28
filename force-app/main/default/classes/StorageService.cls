public with sharing class StorageService {
    
    public static void setStoragePercentUsage(Map<String, Object> limits){    

        System.debug('limits param: ' + JSON.serialize(limits));
           
        Map<String, Object> fileStorageLimits = (Map<String, Object>) limits.get('FileStorageMB');

        Decimal remaining = (Decimal) fileStorageLimits.get('Remaining');
        Decimal max = (Decimal) fileStorageLimits.get('Max');

        Decimal available = (remaining / max) * 100;
        Decimal usage = max - remaining;
    
        Org_Storage_Information__c orgInformationMetadata = new Org_Storage_Information__c(
            Max__c = max,
            Remaining__c = remaining,
            Available__c = available,
            Usage__c = usage,
            Last_consult__c = Datetime.now()
        );

        insert orgInformationMetadata;
    }

    public static Map<String, String> getSessionAttributes(){
        Map<String, String> sessionAttributes = Auth.SessionManagement.getCurrentSession();
        System.debug('sessionAttributes: ' + JSON.serialize(sessionAttributes));

        //** map structure*//
        // SessionId=0Ak###############, 
        // UserType=Standard, 
        // ParentId=0Ak###############, 
        // NumSecondsValid=7200, 
        // LoginType=SAML Idp Initiated SSO, 
        // LoginDomain=null,
        // LoginHistoryId=0Ya###############,
        // ? Username=user@domain.com, 
        // CreatedDate=Wed Jul 30 19:09:29 GMT 2014, 
        // SessionType=Visualforce, 
        // ? LastModifiedDate=Wed Jul 30 19:09:16 GMT 2014, 
        // LogoutUrl=https://google.com, 
        // SessionSecurityLevel=STANDARD,
        // UsersId=005###############, 
        // SourceIp=1.1.1.1

        return sessionAttributes;
    }

    public class FileStorageWrapper{
        public Decimal limitMax {get; set;}
        public Decimal remaining {get; set;}
        public Decimal available {get; set;}
        public Decimal usage {get; set;}

        public FileStorageWrapper(Decimal limitMax, Decimal remaining , Decimal available, Decimal usage){
            this.limitMax = limitMax;
            this.remaining = remaining;
            this.available = available;
            this.usage = usage;
        }
    }
}
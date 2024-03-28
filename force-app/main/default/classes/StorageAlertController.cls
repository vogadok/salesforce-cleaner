public with sharing class StorageAlertController {
   
    @AuraEnabled(cacheable=true)
    public static String getSessionId() {
        return UserInfo.getSessionId();
    }

    @AuraEnabled
    public static OrgLimitDTO getLimits(String storageName){ 
      
        Map<String,System.OrgLimit> limits = OrgLimits.getMap();
        System.OrgLimit fileStorage = limits.get(storageName);

        Decimal available = Decimal.valueOf(fileStorage.getLimit()) - Decimal.valueOf(fileStorage.getValue());
        Decimal usage = fileStorage.getValue();
        Decimal max = (Decimal) fileStorage.getLimit();

        OrgLimitDTO result = new OrgLimitDTO();

        result.limit_name = fileStorage.getName();
        result.remaining = available;
        result.usage = usage;
        result.max = max;

        return result;
    }

    public class OrgLimitDTO{
        @AuraEnabled public String limit_name;
        @AuraEnabled public Decimal remaining;
        @AuraEnabled public Decimal usage;
        @AuraEnabled public Decimal max;
    }

}
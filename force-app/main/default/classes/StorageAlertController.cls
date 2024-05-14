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

    @AuraEnabled
    public static List<Account> getAccountsByType(String accountType){ 
        return [SELECT Id, Name, Type FROM Account WHERE Type =: accountType];
    }

    // @AuraEnabled
    // public static void deleteAccounts(List<Account> accountsToDelete){
    //     try {
    //         delete accountsToDelete;
    //     } catch (Exception e) {
    //         throw e;
    //     }
    // }

    @AuraEnabled
    public static void deleteAccounts(List<Account> accountsToDelete){
        try {
            Set<Id> accountIds = new Set<Id>();
            for (Account acc : accountsToDelete) {
                accountIds.add(acc.Id);
            }
            
            List<Case> casesToUpdate = [SELECT Id, AccountId FROM Case WHERE AccountId IN :accountIds];
            System.debug('casesToUpdate ' + JSON.serialize(casesToUpdate));

            for (Case c : casesToUpdate) {
                c.AccountId = null;
            }

            System.debug('casesToUpdate after for' + JSON.serialize(casesToUpdate));

            
            update casesToUpdate;
            
            delete accountsToDelete;
        } catch (Exception e) {
            throw e;
        }
    }



    public class OrgLimitDTO{
        @AuraEnabled public String limit_name;
        @AuraEnabled public Decimal remaining;
        @AuraEnabled public Decimal usage;
        @AuraEnabled public Decimal max;
    }

}
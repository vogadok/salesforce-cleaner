global class FileStorageManager implements Schedulable {
  
    global void execute(SchedulableContext SC) {

        Map<String, Object> limits = OrgInformationRest.getLimits();
        System.debug('limits: ' + JSON.serialize(limits));
       
        StorageService.setStoragePercentUsage(limits);
    }
 }
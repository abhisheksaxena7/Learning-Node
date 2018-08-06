// Output from spawnSync of stdout of adx salesforce:demo -o DEV,QA --json
let output = `"[14:00:34] Running 'salesforce:demo'...
[{"password":"[jr!$dv4-U","username":"dev-tidhtrn@adxdemo.com","devHubId":"abhishek.saxena@appirio.com","id":"00DR0000001nTutMAE","createdBy":"abhishek.saxena@appirio.com","createdDate":"2018-08-05T08:30:46.000+0000","expirationDate":"2018-08-12","status":"Active","edition":"Developer","orgName":"AppirioDX Demo DEV Org","accessToken":"00DR0000001nTut!ARAAQM7IM.zSQRH8fZVEokk3c.q2UF2EEJ6XpZ7zaeTkbAMoi9zLN.xL5RoJBzHR2JFQOtERlUMm0PEpvOpG6xWaT.MYedq7","instanceUrl":"https://drive-agility-8218-dev-ed.cs2.my.salesforce.com","clientId":"SalesforceDevelopmentExperience","sfdxAuthUrl":"force://SalesforceDevelopmentExperience:1384510088588713504:5Aep8619hWPJoouFYYIhdfc9LDIG3sGd36GkRSV08xxwNZ9SNs6Abqpz2I6flfo9oj3M6sGfsk8GHOFS.kUbENi@drive-agility-8218-dev-ed.cs2.my.salesforce.com","alias":"DEV-ADX-DEMO"},{"password":"bEv8@l8P40","username":"qa-frc4ilr@adxdemo.com","devHubId":"abhishek.saxena@appirio.com","id":"00D54000000D8bkEAC","createdBy":"abhishek.saxena@appirio.com","createdDate":"2018-08-05T08:30:46.000+0000","expirationDate":"2018-08-12","status":"Active","edition":"Developer","orgName":"AppirioDX Demo QA Org","accessToken":"00D54000000D8bk!AQkAQBd0dd7pLkK9ctAFBdIC.bOltin.M0pALeQmSgvjnfpf1KdbXoUWPB9NSSrKxnUn64P75uDxo1c5PyBxG1pRWmBsPmbL","instanceUrl":"https://flow-drive-2734-dev-ed.cs40.my.salesforce.com","clientId":"SalesforceDevelopmentExperience","sfdxAuthUrl":"force://SalesforceDevelopmentExperience:1384510088588713504:5Aep861dR8ARTEERo5KHnvrsXnskgPQ6e0v9zGGz6mtiwPd2ry7yWc99lv8jxq.B6.LydzLzeXy9cH2vBdn7MyF@flow-drive-2734-dev-ed.cs40.my.salesforce.com","alias":"QA-ADX-DEMO"}]
[14:01:16] Finished 'salesforce:demo' after [35m42 s[39m
"`;

output = JSON.parse(output.split('\n')[1]).map((orgInfo) => {
  return {
    alias: orgInfo.alias,
    instanceUrl: orgInfo.instanceUrl,
    password: orgInfo.password,
    username: orgInfo.username,
    authURL: orgInfo.sfdxAuthUrl,
  };
});
console.log(JSON.stringify(output, null, 2));

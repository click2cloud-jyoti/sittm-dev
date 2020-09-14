Param(

[string]$sauceUserName
)
Write-Output "sauce.userName value from ADO was passed as a Argument in the ADO Task called $env:SAUCE_USERNAME " +
"to sauceUserName variable in the Posh. This is the value found=>$sauceUserName"
[Environment]::SetEnvironmentVariable("SAUCE_USERNAME", "$sauceUserName", "User")
var sauceAccessKey = Environment.GetEnvironmentVariable("SAUCE_USERNAME");
Write-Output "sauce.userName value from ADO was passed as a Argument in the ADO Task called $env:SAUCE_USERNAME " +
"to sauceUserName variable in the Posh. This is the value found=>$sauceUserName"

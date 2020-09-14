Param(

[string]$sauceUserName
)
Write-Output "sauce.userName value from ADO was passed as a Argument in the ADO Task called $env:SAUCE_USERNAME " +
"to sauceUserName variable in the Posh. This is the value found=>$sauceUserName"
[Environment]::SetEnvironmentVariable("SAUCE_USERNAME", "$sauceUserName", "User")
[Environment]::SetEnvironmentVariable("SAUCE_USERNAME", "$sauceUserName",[System.EnvironmentVariableTarget]::Machine)

var sauceAccessKey = Environment.GetEnvironmentVariable("SAUCE_USERNAME");
Write-Output "sauce.sauceAccessKey value from ADO was passed as a Argument in the ADO Task called $env:SAUCE_USERNAME " +
"to sauceUserName variable in the Posh. This is the value found=>$sauceAccessKey"


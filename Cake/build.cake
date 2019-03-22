#addin "Cake.WebDeploy"

var password = Argument("password", "");
var task = Argument("task", "Default");
var username = Argument("username", "");

Task("UAT")
    .Description("Deploy to Azure using a custom Url")
    .Does(() =>
    {
        password = password.Replace("<dot>", ".");
        var settings = new DeploySettings()
        {
            Password = password,
            PublishUrl = "https://demosoft.me:8172/msdeploy.axd",
            SiteName = "AngularDwt",
            SourcePath = @"..\dist\AngularDwt",
            UseAppOffline = true,
            Username = username,
        };
        DeployWebsite(settings);
        Console.WriteLine(DateTime.Now);
    });

Task("Default")
    .Does(() => {
        Console.WriteLine("Default");
    });

RunTarget(task);

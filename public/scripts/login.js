var username = document.getElementById("username");
var password = document.getElementById("password");
var login = document.getElementById("login");

login.addEventListener("click", function()
{
  if(username.value && password.value)
  {
    var request = new XMLHttpRequest();
    request.open("post", "/login");
    request.setRequestHeader("Content-type","application/json");
    request.send(JSON.stringify({ username: username.value, password: password.value }));

    request.addEventListener("load", function()
    {
        if(request.status === 200)
        {
          window.location.href = "/";
        }
        else
        {
          console.log("login err", request.responseText)
        }
    })
  }
  else
  {
    console.log("kuch values nhi dali hui");
  }
})
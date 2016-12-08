'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage() {
    function getQueryStringParameter(paramToRetrieve) {
        var params = document.URL.split("?")[1].split("&");
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split("=");
            if (singleParam[0] == paramToRetrieve) return singleParam[1];
        }
    }

    var context = SP.ClientContext.get_current();
    var clientContext = context;
    var web = context.get_web()
    var user;
    var appWebUrl;
    var hostWebUrl;
    var cvList;
    var cvItems;

    var userEmail;
    var userGroups;

    //CV Data
    var inProgress = [];
    //Feedback given list
    var inProgressF = [];

    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {
        if (!window.FileReader) {
            alert('This browser does not support the FileReader API.');
        }

        // Get the add-in web and host web URLs.
        appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));
        hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

        // Load user details
        user = clientContext.get_web().get_currentUser();
        clientContext.load(user);

        clientContext.executeQueryAsync(function () {
            userEmail = user.get_email();
            userGroups = user.get_groups();
            console.log(userEmail);
        });

        getData();
        // getUserName();
    });

    function checkUploadStatus() {
        var hostWebContext = new SP.AppContextSite(clientContext, hostWebUrl);

        cvList = hostWebContext.get_web().get_lists().getByTitle("CV List");
        console.log(cvList);

        var camlQuery = new SP.CamlQuery();
        cvItems = cvList.getItems(camlQuery);

        console.log(cvItems);

        clientContext.load(cvItems);
        clientContext.executeQueryAsync(Function.createDelegate(this, checkUploadAccessSuccess), onGetDataFail);
    }

    function checkUploadAccessSuccess() {
        addVolunteerRow('umstek@live.com', 23, 4, 0);
        setCVStatus('internship', 23, 50);
        addTab(14, "Test data")
        var enumerator = cvItems.getEnumerator();

        console.log(enumerator);

        while (enumerator.moveNext()) {
            var item = enumerator.get_current();
            console.log(item);
            console.log(item.get_item('Feedback_x0020_Given'));
            if (item.get_item('Status') === "In Process") {
                if (~isNaN(item.get_item("Feedback_x0020_Given")) && item.get_item("Feedback_x0020_Given") !== null && item.get_item("Feedback_x0020_Given") !== "") {
                    inProgressF.push(item);
                }
                inProgress.push(item);
            }
        }
        onGetDataSuccess();
    }

    function getData() {
        checkUploadStatus();
        context.executeQueryAsync(onGetDataSuccess, onGetDataFail);
    }

    function onGetDataFail(sender, args) {
        alert(args.get_message());
    }

    function onGetDataSuccess() {
        // Set fields
        $('stat').text('Not yet Reviewed: ' + inProgress.length);
    }

    //// This function prepares, loads, and then executes a SharePoint query to get the current users information
    //function getUserName() {
    //    context.load(user);
    //    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
    //}

    //// This function is executed if the above call is successful
    //// It replaces the contents of the 'message' element with the user name
    //function onGetUserNameSuccess() {
    //    $('#message').text('Hello ' + user.get_title());
    //}

    //// This function is executed if the above call fails
    //function onGetUserNameFail(sender, args) {
    //    alert('Failed to get user name. Error:' + args.get_message());
    //}

    function addVolunteerRow(email, internship, career, masters) {
        var row = "<td>" + email + "</td>\n" +
        "<td>" + internship + "</td>\n" +
        "<td>" + career + "</td>\n" +
        "<td>" + masters + "</td>\n" +
        "<td>" + (internship + career + masters) + "</td>\n";

        $('#volunteer-table-body').append(row);
    }

    function setCVStatus(cvType, numberReviewed, total) {
        $('#' + cvType + "-nr").text(numberReviewed);
        $('#' + cvType + "-nl").text(total - numberReviewed);
        $('#' + cvType + "-t").text(total);
        $('#' + cvType + "-p").text(numberReviewed * 100 / total);
    }

    function setOverallStatus(reviewed, total) {
        $('#cv-reviewed-badge').text(reviewed);
        $('#cv-total-badge').text(total);
    }

    function addTab(batch, tabContent) {
        $('#tabnav').append('<li><a data-toggle="tab" href="#batch' + batch + '"> Batch ' + batch + '</a></li>');
        $('#tabcontent').append('<div id="batch' + batch + '" class="tab-pane fade">' + tabContent + '</div>');
    }
}

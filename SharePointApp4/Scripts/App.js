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
    var web = context.get_web();
    var user;
    var appWebUrl;
    var hostWebUrl;
    var cvList;
    var cvItems;

    var userEmail;
    var userGroups;

    //CV Data
    var allCVs = [];

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
        // checkUploadStatus();
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
        addTab(14, "Test data");
        var enumerator = cvItems.getEnumerator();

        console.log(enumerator);

        while (enumerator.moveNext()) {
            var item = enumerator.get_current();
            allCVs.push(item);
            //console.log(item);
            //console.log(item.get_item('Feedback_x0020_Given'));
            //if (item.get_item('Status') === "In Process") {
            //    if (~isNaN(item.get_item("Feedback_x0020_Given")) && item.get_item("Feedback_x0020_Given") !== null && item.get_item("Feedback_x0020_Given") !== "") {
            //        inProgressF.push(item);
            //    }
            //    inProgress.push(item);
            //}
        }
        context.executeQueryAsync(Function.createDelegate(this, onGetDataSuccess()), onGetDataFail);
    }

    function getData() {
        checkUploadStatus();
    }

    function onGetDataFail(sender, args) {
        alert(args.get_message());
    }

    function onGetDataSuccess() {
        var volunteerDetails = {};

        var internshipReviewed = 0;
        var mastersReviewed = 0;
        var careerReviewed = 0;

        var internshipNotReviewed = 0;
        var mastersNotReviewed = 0;
        var careerNotReviewed = 0;

        var batches = {};

        for (var i = 0; i < allCVs.length; i++) {
            var item = allCVs[i];
            var feedbackGiven = item.get_item("Feedback_x0020_Given");
            var cvType = item.get_item("CVType");
            var batch = item.get_item("Batch");

            if (~isNaN(feedbackGiven) &&
                feedbackGiven !== null &&
                feedbackGiven !== "") {

                if (!volunteerDetails[feedbackGiven]) {
                    volunteerDetails[feedbackGiven] = { 'email': feedbackGiven, 'internship': 0, 'masters': 0, 'career': 0 }
                }

                switch (cvType) {
                    case "Internship":
                        volunteerDetails[feedbackGiven]['internship']++;
                        internshipReviewed++;
                        break;
                    case "Masters":
                        volunteerDetails[feedbackGiven]['masters']++;
                        mastersReviewed++;
                        break;
                    case "Career":
                        volunteerDetails[feedbackGiven]['career']++;
                        careerReviewed++;
                        break;

                    default:
                        break;
                        // ???
                }

            } else {

                switch (cvType) {
                    case "Internship":
                        internshipNotReviewed++;
                        break;
                    case "Masters":
                        mastersNotReviewed++;
                        break;
                    case "Career":
                        careerNotReviewed++;
                        break;

                    default:
                        break;
                        // ???
                }

            }

            if (!batches[batch]) {
                batches[batch] = [];
            }
            batches[batch].push({ name: item.get_item("Student_Name"), email: item.get_item("Email"), status: item.get_item("Status") });

        }

        var volunteerDetailsArray = [];
        for (var detail in volunteerDetails) {
            if (volunteerDetails.hasOwnProperty(detail)) {
                volunteerDetails.push(volunteerDetailsArray[detail]);
            }
        }

        volunteerDetailsArray.sort(function (a, b) {
            return (a['internship'] + a['masters'] + a['career']) - (b['internship'] + b['masters'] + b['career']);
        });

        setOverallStatus(internshipReviewed + mastersReviewed + careerReviewed, internshipReviewed + mastersReviewed + careerReviewed + internshipNotReviewed + mastersNotReviewed + careerNotReviewed);
        setCVStatus('internship', internshipReviewed, internshipReviewed + internshipNotReviewed);
        setCVStatus('masters', mastersReviewed, mastersReviewed + mastersNotReviewed);
        setCVStatus('career', careerReviewed, careerReviewed + careerNotReviewed);

        for (var j = 0; j < volunteerDetailsArray.length; j++) {
            var vol = volunteerDetailsArray[j];
            addVolunteerRow(vol.email, vol.internship, vol.career, vol.masters);
        }

        for (var b in batches) {
            if (batches.hasOwnProperty(b)) {
                addTab(b, batches[b]);
            }
        }

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
        var row = "<tr>" + "<td>" + email + "</td>\n" +
        "<td>" + internship + "</td>\n" +
        "<td>" + career + "</td>\n" +
        "<td>" + masters + "</td>\n" +
        "<td>" + (internship + career + masters) + "</td>\n" + "</tr>\n";

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

    function addTab(batch, cvs) {
        $('#tabnav').append('<li><a data-toggle="tab" href="#batch' + batch + '"> Batch ' + batch + '</a></li>');
        var table = buildTab(cvs);
        $('#tabcontent').append('<div id="batch' + batch + '" class="tab-pane fade">' + table + '</div>');
    }

    function buildTab(cvs) {
        var table = "<table class='table table-hover table-responsive'><thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>";

        for (var i = 0; i < cvs.length; i++) {
            table += buildRow(cvs[i]);
        }

        table += "</table>";
        return table;
    }

    function buildRow(cv) {
        return "<tr>" +
        "<td>" + cv.name + "</td>" + // name
        "<td>" + cv.email + "</td>" + // email
        "<td>" + cv.status + "</td>" + // status
        "</tr>";
    }

}

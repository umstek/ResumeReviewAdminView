<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Page Title
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <div>
        <h2>CV Status</h2>
        <h4><span id="cv-reviewed-badge" class="badge">0</span> out of <span id="cv-total-badge" class="badge">0</span> CVs reviewed. </h4>
        <table class="table table-hover table-responsive">
            <thead>
                <tr>
                    <th>CV Type</th>
                    <th>Number Reviewed</th>
                    <th>Number Left</th>
                    <th>Total</th>
                    <th>% Complete</th>
                </tr>
            </thead>
            <tbody id="cv-table-body">
                <tr>
                    <td>Internship</td>
                    <td id="internship-nr"></td>
                    <td id="internship-nl"></td>
                    <td id="internship-t"></td>
                    <td id="internship-p"></td>
                </tr>
                <tr>
                    <td>Career</td>
                    <td id="career-nr"></td>
                    <td id="career-nl"></td>
                    <td id="career-t"></td>
                    <td id="career-p"></td>
                </tr>
                <tr>
                    <td>Masters</td>
                    <td id="masters-nr"></td>
                    <td id="masters-nl"></td>
                    <td id="masters-t"></td>
                    <td id="masters-p"></td>
                </tr>
            </tbody>
        </table>

        <h2>Volunteer Details</h2>
        <table class="table table-hover table-responsive">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Internship CVs Reviewed</th>
                    <th>Career CVs Reviewed</th>
                    <th>Masters CVs Reviewed</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody id="volunteer-table-body">
            </tbody>
        </table>

        <h2>CVs by batch</h2>
        <ul id="tabnav" class="nav nav-tabs">
        </ul>

        <div id="tabcontent" class="tab-content">
            
        </div>
    </div>

</asp:Content>

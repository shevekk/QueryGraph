if (typeof QueryGraph.UI == 'undefined') {
  QueryGraph.UI = {};
}

/*
 * Top icon bar 
 */
QueryGraph.UI.TopIconsBar = class TopUI 
{
  /**
   * @property {String}             ICON_BAR_DIV_HTML_ID             HTML ID of icon bar div containing icons
   * @property {String}             CONTACT_HTML_ID                  HTML ID of contact icon
   * @property {String}             HELP_HTML_ID                     HTML ID of help icon
   * @property {String}             HOME_HTML_ID                     HTML ID of home icon
   * @property {String}             ICON_LANG_HTML_BASE_ID           BASE HTML ID for language flag
   * @property {String}             ICON_HTML_CLASS                  CLASS of a top icon
   * @property {String}             ICON_LANG_HTML_CLASS             CLASS of a top icon lang flag
   */
  static ICON_BAR_DIV_HTML_ID = "iconBar";

  static CONTACT_HTML_ID = "contactIson";
  static HELP_HTML_ID = "helpIcon";
  static HOME_HTML_ID = "homeIcon";
  static ICON_LANG_HTML_BASE_ID = "topLangIcon_";

  static ICON_HTML_CLASS = "topIcon";
  static ICON_LANG_HTML_CLASS = "topLangIcon";
  

  /*
   * Init the top UI icon and manage actions
   */
  static init()
  {
    let content = '';

    // Add lang icons
    for (const key in QueryGraph.Config.Config.langParams.select)
    {
      content += '<img src="'+QueryGraph.Config.Config.langParams.select[key]+'" id="'+QueryGraph.UI.TopIconsBar.ICON_LANG_HTML_BASE_ID + key+'" lang="'+key+'" alt="'+key+'" class="'+QueryGraph.UI.TopIconsBar.ICON_LANG_HTML_CLASS+'" />'; 
    }

    // Add icon
    content += '<img src="img/address-card.svg" alt="Contact" id="'+QueryGraph.UI.TopIconsBar.CONTACT_HTML_ID+'" class="'+QueryGraph.UI.TopIconsBar.ICON_HTML_CLASS+'" title="'+QueryGraph.Dictionary.Dictionary.get("ICON_CONTACT_DESC")+'" />'; 
    content += '<img src="img/question-circle.svg" alt="Help" id="'+QueryGraph.UI.TopIconsBar.HELP_HTML_ID+'" class="'+QueryGraph.UI.TopIconsBar.ICON_HTML_CLASS+'" title="'+QueryGraph.Dictionary.Dictionary.get("ICON_HELP_DESC")+'" />'; 
    content += '<img src="img/home.svg" alt="Home" id="'+QueryGraph.UI.TopIconsBar.HOME_HTML_ID+'" class="'+QueryGraph.UI.TopIconsBar.ICON_HTML_CLASS+'" title="'+QueryGraph.Dictionary.Dictionary.get("ICON_HOME_DESC")+'" />'; 
    
    $("#" + QueryGraph.UI.TopIconsBar.ICON_BAR_DIV_HTML_ID).html(content);

    // Contact click -> Open contact page
    $("#" + QueryGraph.UI.TopIconsBar.CONTACT_HTML_ID).click(function()
    {
      window.open(QueryGraph.Config.Config.getContactPageUrl());
    });

    // Help click -> Open help page
    $("#" + QueryGraph.UI.TopIconsBar.HELP_HTML_ID).click(function()
    {
      window.open(QueryGraph.Config.Config.getHelpPageUrl());
    });

    // Home click -> Go to home page
    $("#" + QueryGraph.UI.TopIconsBar.HOME_HTML_ID).click(function()
    {
      window.open(QueryGraph.Config.Config.main.homePage);
    });

    // Select current lang icon
    $("#" + QueryGraph.UI.TopIconsBar.ICON_LANG_HTML_BASE_ID+QueryGraph.Config.Config.lang).css("background-color", "#b7d4d2");

    // Lang icon click 
    $("." + QueryGraph.UI.TopIconsBar.ICON_LANG_HTML_CLASS).click(function()
    {
      if (confirm(QueryGraph.Dictionary.Dictionary.get("CHANGE_LANG_VALIDATION")))
      {
        let lang = $(this).attr("lang");

        var url = window.location.href;    
        if (url.indexOf('lang=') > -1)
        {
          // If is in URL -> delete lang param et remplace this
          let urlSplit = url.split('lang=');
          let params = urlSplit[1].split('&');

          url = urlSplit[0];
          url += "lang="+lang;
          for(let i = 1; i < params.length; i++)
          {
            url += "&"+params[i];
          }
        }
        else
        {
          if (url.indexOf('?') > -1)
          {
            url += '&lang='+lang;
          }
          else 
          {
            url += '?lang='+lang;
          }
        }
        window.location.href = url;
      }
    });
  }
}
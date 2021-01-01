if (typeof QueryGraph.Dictionary == 'undefined') {
  QueryGraph.Dictionary = {};
}

/**
 * 
 */
QueryGraph.Dictionary.Dictionary = class Dictionary 
{
  /**
   * @property {String[]}           _content          The content of the loaded dictionnary
   */
  static _content;

  /**
   * Load dictionary for the selected language 
   * @param {String}           language          The target language
   * @param {String}           path              The path 
   * @param {Function}         callback          The callback
   */
  static load(language, path, callback)
  {
    let fileName = path + "dictionary/dictionary_" + language + ".json"

    let jqxhr = $.getJSON(fileName, null)
    .done(function(content)
    {
      QueryGraph.Dictionary.Dictionary._content = content;

      callback();
    })
    .fail(function(d, textStatus, error)
    {
      console.error("getJSON failed, status: " + textStatus + ", error: "+error);
    })
    .always(function()
    {

    });
  }

  /**
   * Get the value
   * @param {String}           key          Key of the value to return
   */
  static get(key)
  {
    return QueryGraph.Dictionary.Dictionary._content[key];
  }
}


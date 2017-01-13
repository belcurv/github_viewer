/* jshint esversion:6 */
/* globals $, console */

$('document').ready(function () {
    
    // init empt DOM object, wo be filled by cacheDom()
    var dom = {},
        
        // GitHub API details
        api = {
            endpoint: 'https://api.github.com/users/',
            params: {
                'User-Agent': 'belcurv'
            }
        };
    
    
    // initialization function, called at the very bottom
    function init() {
        cacheDom();
        bindEvents();
    }
    
    
    // cache various DOM elements for reuse
    function cacheDom() {
        dom.$inputGroup = $('#inputGroup');
        dom.$ghUserInput = dom.$inputGroup.find('#gh-user-input');
        dom.$ghUserBtn = dom.$inputGroup.find('#gh-user-btn');
        dom.$output = $('#output');
    }
    
    
    // bind DOM element events
    function bindEvents() {
        dom.$ghUserBtn.on('click', {user: dom.$ghUserInput}, getUser);
    }
    
    
    // AJAX -> GET user
    function getUser() {
        
        var username = dom.$ghUserInput.val();
        
        $.getJSON(api.endpoint + username, api.params)
            .then(getRepos);   // then call getRepos()
    }
    
    
    // AJAX -> GET repositories
    // receives 'user' object from getUser()
    function getRepos(user) {
        
        return $.getJSON(api.endpoint + user.login + '/repos', api.params)
            .then(function (repos) {
                return {
                    repos: repos,   // combine and return user and repos
                    user: user      // response objects
                };
            })
            .then(handleResponse)
            .then(render);
    }
    
    
    // handle combined response object
    // returns a subset of the data
    function handleResponse(res) {
        
        console.log(res);
        
        if (res.user.message === "Not Found" || res.user.username === '') {
            return 'No User Info Found';
        } else {
            
            return {
                fullname: res.user.name,
                username: res.user.login,
                aviurl: res.user.avatar_url,
                profileurl: res.user.html_url,
                repos: res.repos
            };
        }
    }
    
    
    // render data to DOM
    function render(data) {
        var image = data.aviurl,
            $textGroup = $('<div></div>'),
            $repoGroup = $('<ul></ul>'),
            $h1 = $('<h1></h1>'),
            $h4 = $('<h4></h4>'),
            $img = $('<img>'),
            $a = $('<a></a>');
        
        dom.$output.empty();
        
        $h1
            .addClass('userTitle')
            .html(data.username);
        
        $h4
            .addClass('userFullName')
            .html(data.fullname);
        
        $img
            .addClass('userImage')
            .attr('src', image);
        
        $a
            .addClass('userLink')
            .attr('href', data.profileurl)
            .html(data.profileurl);
        
        $textGroup
            .addClass('textGroup')
            .append($h1)
            .append($h4)
            .append($a);
        
        $repoGroup
            .addClass('repoGroup');
        
        data.repos.forEach(function (repo) {
            $repoGroup.append('<li><pre>' + JSON.stringify(repo, undefined, 2) + '</pre></li>' );
        });
        
        dom.$output
            .append($img)
            .append($textGroup)
            .append($repoGroup);

    }
    
    // fire!
    init();
    
});
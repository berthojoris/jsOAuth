var exports; // define it if it doesnt exist
!function (global) {
    function Url(scheme, username, password, hostname, port, pathname, query_string, fragment)
    {
        /* Set up some defaults */
        this.scheme = scheme || 'http';
        this.protocol = this.scheme + ":";
        this.username = username || "";
        this.password = password || "";
        this.host = hostname.toLowerCase();
        if (port)
        {
            this.port = parseInt(port, 10);
        }
        this.path = pathname || "";
        this.fragment = fragment || "";
        query_string = query_string || "";

        if (this.scheme == 'http' && !this.port)
        {
            this.port = 80;
        }
        else if(this.scheme == 'https' && !this.port)
        {
            this.port = 443;
        }
        else if(this.scheme == 'ftp' && !this.port)
        {
            this.port = 20;
        }

        /* Parse the query string */
        var queryRegex = /\?(([a-zA-Z0-9]|[a-fA-F0-9]{2})*)(=([a-zA-Z0-9]*))?/g;
        var query = {};
        query_string.replace(queryRegex, function (str, $1, $2, $3, $4) {
            query[$1] = $4;
            return str;
        });

        this.query = query;
        this.href = this.toString();
    }

    Url.prototype = {
        href: "",
        scheme: "",
        protocol: "",
        username: "",
        password: "",
        host: "",
        port: "",
        path: "",
        query: {},
        fragment: "",
        toString: function ()
        {
            var url = [this.protocol + '//'];
            if (this.username)
            {
                var authority = this.username;
                if (this.password)
                {
                    authority += ":" + this.password;
                }

                url.push(authority + "@");
            }

            url.push(this.host);

            if ((this.scheme == 'http' && this.port != 80) ||  (this.scheme == 'https' && this.port != 443) ||  (this.scheme == 'ftp' && this.port != 20))
            {
                url.push(":" + this.port);
            }

            url.push(this.path);

            var queryArray = [];
            var queryString = "";

            for (var i in this.query)
            {
                if (this.query[i] !== "")
                {
                    queryArray.push(i + "=" + this.query[i]);
                }
                else
                {
                    queryArray.push(i);
                }
            }

            queryString = queryArray.join("&");

            if (queryString !== "")
            {
                url.push("?" + queryString);
            }

            if (this.fragment)
            {
                url.push("#" + this.fragment);
            }

            return url.join("");
        }
    };

    Url.parse = function (url)
    {
        var regex = /(([a-zA-Z][a-zA-Z0-9+\-\.]+):\/\/)?((([a-zA-Z0-9\-\._~]*)(:([a-zA-Z0-9\-\._~]*))?@)?)([a-zA-Z0-9+\-\._*]*)(:([0-9]*))?(\/(([a-zA-Z\+\-\.\/]|(%[0-9]{2}))*))?(\?(([a-zA-Z0-9]|%[0-9]{2})*(=[a-zA-Z0-9]*)?&?)*)?(#([a-zA-Z0-9]*))?/;
        var matches = url.match(regex);

        var scheme = (matches[2] || "").toLowerCase();
        var username = matches[5];
        var password = matches[7];
        var hostname = matches[8];
        var port = matches[10];
        var pathname = matches[11];
        var query_string = matches[15];
        var fragment = matches[20];

        var location = new Url(scheme, username, password, hostname, port, pathname, query_string, fragment);
        return location;
    }

    global.Url = Url;
}(exports || this);
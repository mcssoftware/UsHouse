function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var queryString = location.href.split("?");
    var results = null;
    if (queryString.length > 1) {
        var queryStringToLower = location.href.split("?")[1].toLowerCase();
        results = regex.exec("?" + queryStringToLower);
    }
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var isNumber = function (n) {
    if (typeof n !== "undefined" && n !== null && !isNaN(parseInt(n)) && isFinite(n) && n > -1) {
        return true;
    } else { return false; }
}

var setMemberPagination = function () {
    $(".members-list_search .search").keypress(function (event) {
        if ((event.keyCode || event.which) == 13) {
            event.preventDefault();
            return false;
        }
    });

    $('#sidebar-form input[type="text"]:not(.hasDatepicker)').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            that.searchVotes("/Votes/MemberVotes");
        }
    });

    var paginationTopOptions = {
        name: "paginationTop",
        paginationClass: "toppagination",
        outerWindow: 1,
        innerWindow: 3
    };

    var paginationBottomOptions = {
        name: "paginationBottom",
        paginationClass: "bottompagination",
        outerWindow: 1,
        innerWindow: 3
    };
    var perPage = 20;
    var options = {
        valueNames: [
            "name",
            { name: "state", attr: "data-state" },
            { name: "district", attr: "data-district" },
             { name: "statedistrict", attr: "data-statedistrict" },
              { name: "position", attr: "data-position" },
            { name: "party", attr: "data-party" }
        ],
        listClass: "members-list",
        page: perPage,
        plugins: [
            ListPagination(paginationTopOptions),
            ListPagination(paginationBottomOptions)
        ]
    };

    //initialize list.js
    var hackerList = new List("members-list-filter", options);
    //onSearch filter
    $(".members-list_search .search").keyup(function () {
        //get the search value
        var searchString = $(this).val();
        hackerList.search(searchString, ["name", "state", "district", "party"]);
        setPaginationInfo(hackerList, initialpageNum * 20);
    });
    var initialpageNum = parseInt(getUrlParameter("page"), 10);
    var initialKeyword = getUrlParameter("keyword");
    var partysearchstring = "";
    if (location.href.split("?")[1]) { partysearchstring = location.href.split("?")[1]; 
    if (partysearchstring == "republican" || partysearchstring == "democrat") {
        $(".members-list_search .search").val(partysearchstring);
        hackerList.search(partysearchstring, ["name", "state", "district", "party"]);
        setPaginationInfo(hackerList, initialpageNum * 20);
    }
    }
    if (initialKeyword) {
        $(".members-list_search .search").val(initialKeyword);
        hackerList.search(initialKeyword, ["name", "state", "district", "party"]);
        setPaginationInfo(hackerList, initialpageNum * 20);
    }
    if (isNumber(initialpageNum) && initialpageNum > 1) {
        hackerList.show(((initialpageNum - 1) * perPage) + 1, perPage);
    }
    setPaginationInfo(hackerList, initialpageNum, perPage);
    $(document).on("click", ".page", function () {
        var selectedPage = parseInt($(this).html(), 10);
        if (isNumber(selectedPage)) {
            $("#currentPage").val(selectedPage);
            setPaginationInfo(hackerList, selectedPage, perPage);
        }
    });
};

var setPaginationInfo = function (list, from, perPage) {
    var totalItemsCount = list.matchingItems.length;
    if (totalItemsCount > 0) {
        if (isNumber(from)) {
            from = ((from - 1) * perPage) + 1;
        } else {
            from = 1;
        }
        var to = from + list.list.children.length - 1;
        var text = from + "&nbsp;-&nbsp;" + to + "&nbsp;of&nbsp;" + totalItemsCount;
        $(".pagination_info").html(text);
    } else {
        $(".pagination_info").html("");
    }
}

var getComputedUrl = function (url) {
    var pageNum = parseInt($("#currentPage").val(), 10);// take pageNumber value
    var keyword = $(".members-list_search .search").val();// take search value
    var hasParam = false;
    var queryString = "?";
    if (pageNum > 1) {
        queryString += "page=" + pageNum;
        hasParam = true;
    }
    if (keyword) {
        if (hasParam) {
            queryString += "&";
        }
        hasParam = true;
        queryString += "keyword=" + keyword;
    }
    window.history.pushState("", "", window.location.href + (hasParam ? queryString : ""));
}

var scrollToSection = function (scrollTo) {
    var target = document.getElementById(scrollTo);
    animate(document.scrollingElement || document.documentElement, "scrollTop", "", 0, target.offsetTop - 30, 400, true);
};

var animate = function (elem, style, unit, from, to, time, prop) {
    if (!elem) {
        return;
    }
    var start = new Date().getTime(), timer = setInterval(function () {
        var step = Math.min(1, (new Date().getTime() - start) / time);
        if (prop) {
            elem[style] = (from + step * (to - from)) + unit;
        }
        else {
            elem.style[style] = (from + step * (to - from)) + unit;
        }
        if (step === 1) {
            clearInterval(timer);
        }
    }, 25);
    if (prop) {
        elem[style] = from + unit;
    }
    else {
        elem.style[style] = from + unit;
    }
};



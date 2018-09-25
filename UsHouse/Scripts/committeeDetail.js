var Ushouse;
(function (Ushouse) {
    "use strict";
    var CommitteeDetailsView = (function () {
        function CommitteeDetailsView() {
            this.sortedCommittees;
            this.subCommitteeVisibleCount = $('#visible-subcommittee-count').data('count');
            var _this = this;
            window.onresize = function () {
                _this.changePanelArrangement();
            };
        }
        // scroll section
        CommitteeDetailsView.prototype.scrollToSection = function (scrollTo) {
            var target = document.getElementById(scrollTo);
            this.animate(document.scrollingElement || document.documentElement, "scrollTop", "", 0, target.offsetTop - 30, 400, true);
        };
        CommitteeDetailsView.prototype.animate = function (elem, style, unit, from, to, time, prop) {
            if (!elem) {
                return;
            }
            var start = new Date().getTime();
            var timer = setInterval(function () {
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
        CommitteeDetailsView.prototype.filterMembers = function () {
            this.input = document.getElementById("searchBox");
            this.filter = this.input.value.toUpperCase();
            var list = document.getElementById("majority-members");
            var li = list.getElementsByTagName("li");
            this.loop(list, li, this.filter);
            list = document.getElementById("minority-members");
            li = list.getElementsByTagName("li");
            this.loop(list, li, this.filter);
        };
        CommitteeDetailsView.prototype.loop = function (list, li, filter) {
            var resultCount = 0;
            var nomatch = list.getElementsByClassName("nomatch");
            for (var i = 0; i < li.length; i++) {
                var a = li[i].getElementsByTagName("span")[0];
                if (typeof (a) !== "undefined") {
                    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                        li[i].style.display = "";
                        resultCount += 1;
                    }
                    else {
                        li[i].style.display = "none";
                    }
                }
            }
            if (resultCount <= 0) {
                if (nomatch.length <= 0) {
                    var nomatchfound = document.createElement("li");
                    nomatchfound.innerHTML = "No match found";
                    nomatchfound.setAttribute("class", "nomatch");
                    list.appendChild(nomatchfound);
                }
            }
            else {
                if (nomatch.length > 0) {
                    list.removeChild(nomatch[0]);
                }
            }
        };

        CommitteeDetailsView.prototype.arrangeCommittees = function (index) {
            var committees = $('.committee');
            this.sortedCommittees = committees.sort(function (a, b) {
                return +a.dataset.index - +b.dataset.index;
            });
            var committee = this.sortedCommittees.eq(index);
            console.log(committee.find('.expand-committee'));
            var link = committee.children().find('.expand-committee').eq(0);
            if (link.data('expanded')) {
                link.text('more...');
                link.attr('aria-label', 'show more subcommittees')
                link.data('expanded', false);
            }
            else {
                link.text('...less');
                link.attr('aria-label', 'show less subcommittees')
                link.data('expanded', true);
            }
            var subcommittees = committee.find('li');
            if (subcommittees.length > this.subCommitteeVisibleCount) {
                console.log(subcommittees.length);
                for (var i = this.subCommitteeVisibleCount; i < subcommittees.length; i++) {
                    subcommittees[i].hidden = !subcommittees[i].hidden;
                }
                this.changePanelArrangement();
            }
        };

        CommitteeDetailsView.prototype.changePanelArrangement = function () {
            if (Array.isArray(this.sortedCommittees)) {
                if (!$('#panel-desktop').data('organized') && window.innerWidth >= 768) {
                    for (var i = 0; i < this.sortedCommittees.length; i++) {
                        this.sortedCommittees.removeClass('col-md-6');
                        if (i % 2 == 0)
                            $('#left').append(this.sortedCommittees.eq(i));
                        else
                            $('#right').append(this.sortedCommittees.eq(i));
                    }
                    $('#panel-desktop').data('organized', true);
                }
                else {
                    if (window.innerWidth < 768 && $('#panel-desktop').data('organized')) {
                        for (var i = 0; i < this.sortedCommittees.length; i++) {
                            $('#panel-desktop').parent().append(this.sortedCommittees[i])
                        }
                        $('#panel-desktop').data('organized', false);
                    }
                }
            }
        }
        return CommitteeDetailsView;
    }());
    Ushouse.CommitteeDetailsView = CommitteeDetailsView;
})(Ushouse || (Ushouse = {}));

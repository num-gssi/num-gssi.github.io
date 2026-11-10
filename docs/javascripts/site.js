/* Progressive enhancement: all content and navigation remain usable without JS. */
(function () {
  'use strict';
  var main = document.getElementById('main-content');
  if (!main) return;
  if (main.querySelector('h1#faculty')) {
    Array.from(main.querySelectorAll('h3')).forEach(function(heading){
      var section=document.createElement('section');section.className='people-entry';
      heading.before(section);section.append(heading);
      var next=section.nextSibling;
      while(next && !(next.nodeType===1 && /^H[123]$/.test(next.tagName))){var following=next.nextSibling;section.append(next);next=following;}
    });
    main.querySelectorAll('.people-entry .people_photo').forEach(function(img){
      function fallback(){
        if(!img.isConnected)return;
        var name=img.closest('.people-entry').querySelector('h3').textContent.trim();
        var placeholder=document.createElement('span');placeholder.className='people_photo portrait-fallback';
        placeholder.textContent=name.split(/\s+/).filter(Boolean).map(function(part){return part[0];}).slice(0,2).join('');
        placeholder.setAttribute('role','img');placeholder.setAttribute('aria-label','Portrait unavailable: '+name);img.replaceWith(placeholder);
      }
      img.addEventListener('error',fallback,{once:true});
      if(img.complete && img.naturalWidth===0)fallback();
    });
  }
  var heading = main.querySelector('h1');
  var isArchive = heading && /NOMADS Seminars|COMPiLE Reading Group/.test(heading.textContent);
  if (isArchive) {
    main.classList.add('seminar-archive');
    var years = Array.from(main.querySelectorAll('h3[id]')).filter(function (h) { return /Academic Year/.test(h.textContent); });
    if (years.length) {
      var nav = document.createElement('nav');
      nav.className = 'archive-years';
      nav.setAttribute('aria-label', 'Browse by academic year');
      years.forEach(function (h) {
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent.replace('Academic Year ', '');
        nav.appendChild(a);
      });
      years[0].before(nav);
    }
    main.querySelectorAll('table').forEach(function (table) {
      var first = table.querySelector('thead');
      if (!first || !/Presenter|Speaker/.test(first.textContent)) return;
      table.classList.add('event-table');
      table.querySelectorAll('tbody tr').forEach(function (row) {
        var cell = row.cells[2];
        if (!cell) return;
        var title = cell.querySelector('strong');
        if (!title) return;
        var nodes = Array.from(cell.childNodes);
        var index = nodes.indexOf(title);
        if (index < 0) return;
        var remainder = nodes.slice(index + 1);
        if (!remainder.some(function (n) { return n.textContent.trim() || n.nodeName === 'A'; })) return;
        var details = document.createElement('details');
        details.className = 'abstract-details';
        var summary = document.createElement('summary');
        summary.textContent = 'Abstract & materials';
        var body = document.createElement('div');
        body.className = 'abstract-body';
        remainder.forEach(function (node) { body.appendChild(node); });
        while (title.nextSibling) title.nextSibling.remove();
        details.append(summary, body);
        cell.appendChild(details);
      });
    });
  }
  main.querySelectorAll('table:not(.event-table)').forEach(function (table) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    table.before(wrapper);
    wrapper.appendChild(table);
  });
  main.querySelectorAll('img').forEach(function (img) {
    if (!img.closest('.gran-sasso-banner')) { img.loading = 'lazy'; img.decoding = 'async'; }
    if (!img.hasAttribute('alt')) img.alt = '';
  });
  document.querySelectorAll('iframe').forEach(function (frame) {
    if (!frame.title) frame.title = /calendar/.test(frame.src) ? 'GSSI group calendar' : 'Map of the GSSI venue';
    frame.loading = 'lazy';
  });
  var searchForm = document.querySelector('#mkdocs_search_modal form');
  if (searchForm) searchForm.addEventListener('submit', function (event) { event.preventDefault(); });
  var searchInput = document.getElementById('mkdocs-search-query');
  if (searchInput) searchInput.addEventListener('input', function () {
    if (typeof window.doSearch === 'function' && typeof window.min_search_length === 'number') window.doSearch();
  });
})();
/* Content stays in the original Markdown pages. No separate seminar database. */
(function () {
  'use strict';
  var list = document.getElementById('upcoming-list');
  if (!list) return;
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var today = {};
  new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/Rome',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).forEach(function(p){today[p.type]=p.value;});
  var todayKey = Number(today.year + today.month + today.day);
  function lines(cell) {
    var clone = cell.cloneNode(true);
    clone.querySelectorAll('br').forEach(function(br){br.replaceWith('\n');});
    return clone.textContent.split('\n').map(function(s){return s.trim();}).filter(Boolean);
  }
  function readPage(path, series) {
    return fetch(path).then(function(response){if(!response.ok) throw Error('Cannot read '+path); return response.text();}).then(function(html){
      var doc = new DOMParser().parseFromString(html,'text/html');
      var events = [];
      doc.querySelectorAll('table').forEach(function(table){
        if (!table.tHead || !/Presenter|Speaker/.test(table.tHead.textContent)) return;
        table.querySelectorAll('tbody tr').forEach(function(row){
          if(row.cells.length<4) return;
          var title = row.cells[2].querySelector('strong');
          if(!title) return;
          var dateText = lines(row.cells[3]).join(' · ');
          var match = dateText.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?,\s*(\d{4})/);
          if(!match) return;
          var month = monthNames.indexOf(match[1]), day = Number(match[2]), year = Number(match[4]);
          var key = year*10000+(month+1)*100+day;
          var endKey=year*10000+(month+1)*100+Number(match[3]||day);
          if(endKey<todayKey) return;
          var presenter = lines(row.cells[1]);
          var anchor = row.cells[2].querySelector('[id]');
          var previous = table.previousElementSibling;
          while(!anchor && previous){if(previous.matches('h3[id]')){anchor=previous;break;}previous=previous.previousElementSibling;}
          var time = dateText.match(/\b\d{1,2}:\d{2}\s*(?:AM|PM)\b/i);
          var venue = row.cells[3].querySelector('a');
          events.push({series:series,title:title.textContent.trim(),speaker:presenter[0]||'',affiliation:presenter.slice(1).join(' · '),date:day+(match[3]?'–'+match[3]:'')+' '+match[1].slice(0,3)+' '+year,iso:year+'-'+String(month+1).padStart(2,'0')+'-'+String(day).padStart(2,'0'),key:key,time:time?time[0]:'',venue:venue?venue.textContent.trim():'',tentative:/date to be confirmed|tentative/i.test(dateText),url:path+(anchor?'#'+anchor.id:'')});
        });
      });
      return events;
    });
  }
  function element(tag, className, text){var el=document.createElement(tag);el.className=className;if(text)el.textContent=text;return el;}
  function render(event){
    var card=element('article','seminar-card');
    var badges=element('div','seminar-badges');badges.append(element('span','series-label',event.series));
    if(event.tentative)badges.append(element('span','tentative-label','Date to be confirmed'));
    var date=element('p','seminar-date'),time=element('time','',event.date);time.dateTime=event.iso;date.append(time);
    var title=element('h3',''),link=element('a','',event.title);link.href=event.url;title.append(link);
    card.append(badges,date,title,element('p','seminar-speaker',event.speaker),element('p','',event.affiliation),element('p','seminar-venue',[event.time?event.time+' · Rome time':'',event.venue].filter(Boolean).join(' · ')||'Time and venue to be announced'));
    var details=element('a','','Seminar details →');details.href=event.url;card.append(details);return card;
  }
  Promise.allSettled([readPage('seminar/','NOMADS'),readPage('reading_group/','COMPiLE')]).then(function(results){
    var events=[];var failed=false;
    results.forEach(function(result){if(result.status==='fulfilled')events=events.concat(result.value);else failed=true;});
    list.replaceChildren();
    events.sort(function(a,b){return a.key-b.key;}).slice(0,3).forEach(function(event){list.append(render(event));});
    if(!events.length){var message=element('p','upcoming-status',failed?'Upcoming dates are available in the seminar pages and calendar.':'New talks are on the way. Dates will be announced here.');list.append(message);}
    if(failed && events.length)list.append(element('p','upcoming-status','Check both seminar pages for the full programme.'));
  });
})();


/* Background motion is optional and independent of seminar content. */
(function(){
  'use strict';
  var button=document.querySelector('.landscape-toggle');if(!button)return;
  var paused=false;
  try{paused=localStorage.getItem('gssi-background-paused')==='true';}catch(_){}
  function update(){document.documentElement.classList.toggle('landscape-paused',paused);button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Resume background':'Pause background';}
  update();
  button.addEventListener('click',function(){paused=!paused;update();try{localStorage.setItem('gssi-background-paused',String(paused));}catch(_){}});
})();

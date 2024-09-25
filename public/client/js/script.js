import * as RabbitLyrics from "https://unpkg.com/rabbit-lyrics";


const formSearch = document.querySelector('[form-search]');

// click form-search => redirect to : "/search/result"
if(formSearch){
  formSearch.addEventListener('click', () => {
    const url = new URL(window.location.href);
    const searchUrl = url.origin + '/search/result'

    if(url.href != searchUrl){
      window.location.href = '/search/result';
    }
  })
}
// End click form-search => redirect to : "/search/result"

// sugguest search
if(formSearch) {
  const input = formSearch.querySelector('input');
  const searchSugguest = document.querySelector('[search-suguest]');
  input.addEventListener('keyup', () => {
    const keyword = input.value;
    fetch(`/search/sugguest?keyword=${keyword}`)
      .then(res => res.json())
      .then(data => {
        if(data.code == 200){
          const listSong = data.song.map(item => `
            <div class="inner-song">
              <div class="inner-info">
                <img src=${item.avatar} alt=""/>
                <div class="inner-content"> 
                  <div class="inner-name">${item.title}</div>
                  <div class="inner-singer">
                    <a href="">${item.singer}</a>
                  </div>
                </div>
              </div>
              <div class="inner-time">5:34</div>
            </div>
            ` 
          )
          searchSugguest.innerHTML = listSong.join(''); // bỏ giấu chấm phẩy
        }
      })
  })
}
// end sugguest search


// audio
const audio = document.querySelector('[audio]');
const progressBar = document.querySelector('[progress-bar]');

// format-time-function : chỉ format thời gian dưới 1 giờ đồng hồ
const formatTime = (time) => {
  const susplusSecond = time%60; // số giây dư ra
  const second = (susplusSecond > 9 ? susplusSecond : `0${susplusSecond}`); // số giây - đã format
  let timeFormated; // time -start
  if(time < 60) {
    timeFormated = `0:${second}`;
  } else {
    const munite = Math.floor(time/60);
    timeFormated = `${munite}:${second}`
  }
  return timeFormated;
}
// End format-time-function

// audio-in-main : assign src to audio
const audioInMain = document.querySelector('[audio-in-main]');
if(audioInMain) {
  setTimeout(() => {
    const timeEnd = document.querySelector('[time-end]');
    const durationTime = Math.round(audioInMain.duration);
    timeEnd.innerHTML = formatTime(durationTime);
  }, 1000);   // nguyên lý của duration là load hết file thì mới dùng đc, nên file dài quá là cút 
  audio.src = audioInMain.src; // gán link audio mới
  const audioId = audioInMain.getAttribute('audio-in-main');
  audio.setAttribute('audio-id', audioId); // set id hiện tại cho audio
}
// End audio-in-main

if(audio && progressBar) {
  const playAudio = document.querySelector('[play-audio]');

  // pause - play 
  playAudio.addEventListener('click', () => {
    if(audio.paused){
      audio.play();
    } else {
      audio.pause();
    }
  })
  // End pause-play

  // update progress-bar
  const timeFilled = progressBar.querySelector('[time-filled]');
  const timeStart = progressBar.querySelector('[time-start'); 
  audio.addEventListener('timeupdate', () => {
    let timeRate = audio.currentTime / audio.duration; // tỉ lệ thời gian thực / tổng thời gian
    timeRate *= 100; // set width theo đơn vị %
    if(timeFilled){
      timeFilled.style.width = timeRate + '%';
    }
    // time-start
    if(timeStart){
      const currentTime = Math.round(audio.currentTime);
      timeStart.innerHTML = formatTime(currentTime);  // cập nhật thời gian nghe theo thời gian thực của audio
    }
    // End time-start
  })
  // End update progress-bar

  
}
// End audio

// random-song : chọn nghe ngẫu nhiên
const randomSong = document.querySelector('[random-song]');
if(randomSong) {
  randomSong.addEventListener('click', () => {
    if(audio) {
      const audioCurrentId = audio.getAttribute('audio-id');
      fetch(`/song/random`, {
        method : "POST",   // mới làm lần đầu nên làm phương thức POST, phía dưới gán query đơn giản hơn
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioId : audioCurrentId }),
        
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == 200 && audio) {
            audio.src = data.song.audio;
            audio.setAttribute('audio-id', data.song.id);
            setTimeout(() => {
              const timeEnd = document.querySelector('[time-end]');
              const durationTime = Math.round(audio.duration);
              timeEnd.innerHTML = formatTime(durationTime);
            }, 500);
            const timeFilled = progressBar.querySelector('[time-filled]');
            timeFilled.style.width = '0%';
          }
        })
    }
  })
}
// End random-song

// previous-audio
const previousAudio = document.querySelector('[previous-audio]');
if(previousAudio && audio) {
  previousAudio.addEventListener('click', () => {
    const audioCurrentId = audio.getAttribute('audio-id');  // id của audio hiện tại
    fetch(`/song/previous-audio?audioCurrentId=${audioCurrentId}`)
      .then (res => res.json())
      .then (data => {
        if(data.code == 200) {
          audio.src = data.song.audio;
          console.log(data.song.id)
          audio.setAttribute('audio-id', data.song.id);
          setTimeout(() => {
            const timeEnd = document.querySelector('[time-end]');
            const durationTime = Math.round(audio.duration);
            timeEnd.innerHTML = formatTime(durationTime);
          }, 500);
          const timeFilled = progressBar.querySelector('[time-filled]');
          timeFilled.style.width = '0%';
        }
      })
  })
}
// End previous-audio

// next-audio
const nextAudio = document.querySelector('[next-audio]');
if(nextAudio && audio) {
  nextAudio.addEventListener('click', () => {
    const audioCurrentId = audio.getAttribute('audio-id'); // id của audio hiện tại
    fetch(`/song/next-audio?audioCurrentId=${audioCurrentId}`)
      .then (res => res.json())
      .then (data => {
        if(data.code == 200) {
          audio.src = data.song.audio;
          audio.setAttribute('audio-id', data.song.id);
          setTimeout(() => {
            const timeEnd = document.querySelector('[time-end]');
            const durationTime = Math.round(audio.duration);
            timeEnd.innerHTML = formatTime(durationTime);
          }, 500);
          const timeFilled = progressBar.querySelector('[time-filled]'); 
          timeFilled.style.width = '0%';  // set lại width cho thanh progressBar
        }
      })
  })
}
// End previous-audio


// loop-audio : nghe lặp lại
const loopAudio = document.querySelector('[loop-audio]');
if(loopAudio && audio) {
  loopAudio.addEventListener('click', () => {
    if(audio.loop) {
      audio.loop = false;
    } else {
      audio.loop = true;
    }
  })
}
// End loop-audio

// time-filled : move special time
const timeLine = document.querySelector('[time-line]');
if(timeLine && audio) {
  timeLine.addEventListener('click', (event) => {
    let widthCssTimeLine = window.getComputedStyle(timeLine, null).getPropertyValue('width');  // độ dài thanh progressBar theo đơn vị px
    widthCssTimeLine = parseInt(widthCssTimeLine.slice(0, widthCssTimeLine.length-2)); // 350px => 300
    const specificTimeChoosen = (event.offsetX / widthCssTimeLine) ; //  tỉ lệ giữa thời gian được chọn và độ dài thanh progressBar
    const currentTime = audio.duration * specificTimeChoosen; // thời gian được chọn
    audio.currentTime = currentTime;
  })
}

// End time-filled : move special time



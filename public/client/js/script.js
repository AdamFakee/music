

const formSearch = document.querySelector('[form-search]');

// click form-search => redirect to : "/search/result"
if(formSearch){
  formSearch.addEventListener('click', () => {
    const url = new URL(window.location.href);
    const searchUrl = url.origin + '/search/result'
    const currentUrl = url.href.split('?')[0]

    if(currentUrl != searchUrl){
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
          const listSong = data.songs.map(item => `
            <div class="inner-song">
              <div class="inner-info">
                <img src=${item.avartar} alt=""/>
                <div class="inner-content"> 
                  <a href='/song/detail/${item.slug}' class="inner-name">${item.songName}</a>
                  <div class="inner-singer">
                    <a href='#'>${item.singerName}</a>
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


let songInQueue = []; // hàng đợi ưu tiên chứa các bài hát được chọn : FIFO
const songInQueueInLocalStorage = localStorage.getItem('songInQueue');
if(songInQueueInLocalStorage) {
  // songInQueue = [];
  const arrSongId = songInQueueInLocalStorage.split(',');
  arrSongId.forEach(item => {
    songInQueue.push(item);
  })
}
// add-to-queue
const addToQueue = document.querySelectorAll('[add-to-queue]');
if(addToQueue.length) {
  addToQueue.forEach(song => {
    song.addEventListener('click', () => {
      const songId = song.getAttribute('add-to-queue');

      // songId đã tồn tại => click => đẩy nó ra sau cùng
      if(songInQueue.includes(songId)) { 
        const index = songInQueue.indexOf(songId);
        if (index > -1) { 
          songInQueue.splice(index, 1); // xóa songId tại vị trí cũ
          songInQueue.push(songId);
        }
      } else {
        songInQueue.push(songId);
      }

      // lưu cái hàng đợi vô local storage tránh khi load trang bị mất dữ liệu
      localStorage.setItem('songInQueue', songInQueue);
    })
  })
}
// End add-to-queue

// audio
const audio = document.querySelector('[audio]'); // ở thanh footer
const progressBar = document.querySelector('[progress-bar]'); // ở thanh footer 

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
        method : "POST",   // mới làm lần đầu nên làm phương thức POST, phía dưới gán query đơn giản hơn - này là non 
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
    if(songInQueue.length) {
      const songId = songInQueue.shift();
      // localStorage.setItem('songInQueue', songInQueue); nghe xong muốn nghe lại bài trước đó trong hàng đợi : chưa xử lí 
      fetch(`/song/previous-audio/queue?songId=${songId}`)
        .then (res => res.json())
        .then (data => {
          if(data.code == 200) {
            console.log(data)
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
    } else {
      const audioCurrentId = audio.getAttribute('audio-id');  // id của audio hiện tại
      fetch(`/song/previous-audio/nomal?audioCurrentId=${audioCurrentId}`)
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
      }
  })
}
// End previous-audio

// next-audio
const nextAudio = document.querySelector('[next-audio]');
if(nextAudio && audio) {
  nextAudio.addEventListener('click', () => {
    if(songInQueue.length) {
      const songId = songInQueue.shift();
      localStorage.setItem('songInQueue', songInQueue);
      fetch(`/song/next-audio/queue?songId=${songId}`)
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
    } else {
      const audioCurrentId = audio.getAttribute('audio-id'); // id của audio hiện tại
      fetch(`/song/next-audio/nomal?audioCurrentId=${audioCurrentId}`)
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
            timeFilled.style.width = '0%';  // set lại width cho thanh progressBar
          }
        })
    }
  })
}
// End next-audio


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

// button-queue : show queue
const buttonQueue = document.querySelector('[button-queue]');
if(buttonQueue) {
  const queue = document.querySelector('[queue]');
  let exitShow = queue.classList.contains('show'); // check xem đã tồn tại class show hay chưa
  console.log(exitShow)
  buttonQueue.addEventListener('click', () => {
    if(songInQueue.length) {  // check hàng đợi rỗng
      if(!exitShow) {   // chưa tồn tại class 'show' => đc call api
        fetch('/song/queue/detail', {
          method : 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ songInQueue : songInQueue }),
        })
          .then(res => res.json())
          .then(data => {
            const songs = data.songs;
            const songSorted = []; // sắp xếp lại theo thứ tự trong songInQueue
            for(let i of songInQueue) {
              for(let y of songs) {
                if(i == y.id) {
                  songSorted.push(y);
                  break;
                }
              }
            }
            const htmlSongs = songSorted.map(item => `<a class="inner-item" href="/song/detail/${item.slug}"> ${item.name} </a>`); // chưa 1 mảng các thẻ html
            queue.innerHTML = htmlSongs.join('')
          })
      }
    } else {
      queue.innerText = 'hàng đợi rỗng';
    }
    queue.classList.toggle('show');
  })
  
  document.body.addEventListener('click', (event) => {
    exitShow = queue.classList.contains('show');
    const eventTarget = event.target; // nút được click
    const i = buttonQueue.querySelector('i'); // thẻ i ở trong buttonQueue
    if(exitShow && eventTarget != buttonQueue && eventTarget != i) {
      queue.classList.remove('show');
    }
  })
}

// End button-queue


// nghe xong chuyển bài mới : cho nó như next-audio luôn
setInterval(() => {  // 0.5s check xem audio chạy hết chưa
  if(nextAudio && audio && audio.ended) {
    if(songInQueue.length) {
      const songId = songInQueue.shift();
      localStorage.setItem('songInQueue', songInQueue);
      fetch(`/song/next-audio/queue?songId=${songId}`)
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
    } else {
      const audioCurrentId = audio.getAttribute('audio-id'); // id của audio hiện tại
      fetch(`/song/next-audio/nomal?audioCurrentId=${audioCurrentId}`)
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
            timeFilled.style.width = '0%';  // set lại width cho thanh progressBar
          }
        })
    }
  }
}, 500);
// End nghe xong chuyển bài mới

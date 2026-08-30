function changeColor(event) {
    var element = event.target;
    element.classList.toggle('clicked');
    syncHeartWithLike(element);
}

function likeColor(event) {
    var element = event.target;
    element.classList.toggle('saved');
}

function syncHeartWithLike(heartElement) {
    var box = heartElement.closest('.box');
    if (!box) return;
    var likesCount = box.querySelector('.likes-count');
    if (!likesCount) return;
    var liked = heartElement.classList.contains('clicked');
    likesCount.textContent = liked ? 'A ti y a otros les gusta esto' : 'Sé el primero en decir que te gusta';
}

function burstHeart(box) {
    var heart = box.querySelector('.heart-burst');
    if (!heart) return;
    heart.classList.remove('animate');
    // Force reflow so the animation can be re-triggered on repeated double clicks.
    void heart.offsetWidth;
    heart.classList.add('animate');
}

function likePost(box) {
    var heartIcon = box.querySelector('[onclick="changeColor(event)"]');
    if (heartIcon && !heartIcon.classList.contains('clicked')) {
        heartIcon.classList.add('clicked');
        syncHeartWithLike(heartIcon);
    }
    burstHeart(box);
}

function enhancePost(box, index) {
    // Post header with avatar + "Day N" username, Instagram style.
    if (!box.querySelector('.post-header')) {
        var header = document.createElement('div');
        header.className = 'post-header';
        header.innerHTML =
            '<span class="post-avatar"><img src="./img/logo_our_world.png" alt="avatar"></span>' +
            '<span class="post-username">Dia ' + (index + 1) + '</span>' +
            '<span class="material-symbols-outlined post-options">more_horiz</span>';
        box.insertBefore(header, box.firstChild);
    }

    // Wrap the figure image so the double-tap heart animation can be positioned over it.
    var figure = box.querySelector('figure');
    var img = figure ? figure.querySelector('img') : null;
    if (figure && img && !img.closest('.figure-wrapper')) {
        var wrapper = document.createElement('div');
        wrapper.className = 'figure-wrapper';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        var heartBurst = document.createElement('span');
        heartBurst.className = 'material-symbols-outlined heart-burst';
        heartBurst.textContent = 'favorite';
        wrapper.appendChild(heartBurst);

        img.addEventListener('dblclick', function () {
            likePost(box);
        });
    }

    // Likes count line, Instagram style, placed under the interaction icons.
    if (!box.querySelector('.likes-count')) {
        var likes = document.createElement('p');
        likes.className = 'likes-count';
        likes.textContent = 'Sé el primero en decir que te gusta';
        var interact = box.querySelector('.interact-seccion');
        if (interact) {
            interact.insertAdjacentElement('afterend', likes);
        } else {
            box.appendChild(likes);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var boxes = document.querySelectorAll('.main-section .box');
    boxes.forEach(function (box, index) {
        enhancePost(box, index);
    });
});

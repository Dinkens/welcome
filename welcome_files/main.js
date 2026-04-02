// РњРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ
$('.open-modal').click(function() {
    $('.sm-quest-modal').addClass('sm-open')
    $('body').addClass('lock')
})

$('.sm-quest-modal-close').click(function() {
    $('.sm-quest-modal').removeClass('sm-open')
    $('body').removeClass('lock')
})

const wishSliderParams = {
    slidesToShow: 1,
    infinite: true,
    adaptiveHeight: false,
    nextArrow: document.querySelector('.sm-wishes-slider_next'),
    prevArrow: document.querySelector('.sm-wishes-slider_prev'),
}

function updateWishPagination(currentIndex, totalSlides) {
    $('#current-slide').text(currentIndex + 1);
    $('#count-slides').text(totalSlides);
}

function normalizeWishSliderMarkup() {
    const slider = $('.sm-wishes__content-slider');
    if (!slider.length) {
        return slider;
    }

    const staticTrack = slider.find('> .slick-list > .slick-track');
    if (staticTrack.length) {
        const originalSlides = staticTrack
            .children('.sm-wishes__content-item')
            .not('.slick-cloned')
            .map(function () {
                const slide = $(this).clone();
                slide.removeClass('slick-slide slick-current slick-active slick-center slick-visible');
                slide.removeAttr('aria-hidden tabindex style data-slick-index id');
                return $('<div>').append(slide).html();
            })
            .get()
            .join('');

        slider
            .removeClass('slick-initialized slick-slider')
            .html(originalSlides);
    }

    return slider;
}

function initWishSlider() {
    const slider = normalizeWishSliderMarkup();
    if (!slider.length) {
        return;
    }

    const slides = slider.children('.sm-wishes__content-item');
    if (!slides.length) {
        return;
    }

    let currentIndex = 0;

    function showWishSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        slides.each(function (slideIndex) {
            const isActive = slideIndex === currentIndex;
            $(this)
                .toggleClass('is-active', isActive)
                .attr('aria-hidden', isActive ? 'false' : 'true')
                .css('display', isActive ? '' : 'none');
        });
        updateWishPagination(currentIndex, slides.length);
    }

    wishSliderParams.prevArrow?.removeEventListener?.('click', wishSliderParams.prevArrow._wishHandler);
    wishSliderParams.nextArrow?.removeEventListener?.('click', wishSliderParams.nextArrow._wishHandler);

    if (wishSliderParams.prevArrow) {
        wishSliderParams.prevArrow._wishHandler = function () {
            showWishSlide(currentIndex - 1);
        };
        wishSliderParams.prevArrow.addEventListener('click', wishSliderParams.prevArrow._wishHandler);
    }

    if (wishSliderParams.nextArrow) {
        wishSliderParams.nextArrow._wishHandler = function () {
            showWishSlide(currentIndex + 1);
        };
        wishSliderParams.nextArrow.addEventListener('click', wishSliderParams.nextArrow._wishHandler);
    }

    slider.css({
        display: 'block',
        opacity: '1'
    });

    showWishSlide(0);
}

window.initWishSlider = initWishSlider;

function onResize(){
    initWishSlider();

    $('.sm-dress-code__slider1').slick({
        slidesToShow: 1,
        infinite: true,
        adaptiveHeight: true,
        nextArrow: $('.sm-dress-code__slider1').parents('.sm-dress-code__box-gallery__item').find('.arrow-next'),
        prevArrow: $('.sm-dress-code__slider1').parents('.sm-dress-code__box-gallery__item').find('.arrow-prev'),
    });

    $('.sm-dress-code__slider2').slick({
        slidesToShow: 1,
        infinite: true,
        adaptiveHeight: true,
        nextArrow: $('.sm-dress-code__slider2').parents('.sm-dress-code__box-gallery__item').find('.arrow-next'),
        prevArrow: $('.sm-dress-code__slider2').parents('.sm-dress-code__box-gallery__item').find('.arrow-prev'),
    });

}
//
// $(window).on('resize', function() {
//     onResize();
// });
function startAll() {
    startAllScripts();
    onResize();
}

$(function () {
    initWishSlider();
    setTimeout(initWishSlider, 300);
});

$(window).on('load', function () {
    initWishSlider();
});
const forms = document.querySelectorAll('.contact-form');
const thankYouMessage = document.getElementById('thankYouMessage');
const body = document.body;

function openThankYouModal() {
    if (!thankYouMessage) {
        return;
    }

    thankYouMessage.classList.add('active');
    thankYouMessage.classList.add('sm-open');
    body.classList.add('sm-hidde');
}

window.thankYou = openThankYouModal;
globalThis.thankYou = openThankYouModal;

function getGoogleScriptUrl() {
    if (window.siteConfig && window.siteConfig.rsvp && window.siteConfig.rsvp.googleAppsScriptUrl) {
        return window.siteConfig.rsvp.googleAppsScriptUrl;
    }

    if (window.parent && window.parent.siteConfig && window.parent.siteConfig.rsvp) {
        return window.parent.siteConfig.rsvp.googleAppsScriptUrl || '';
    }

    return '';
}

function getFormScope(trigger) {
    const $trigger = $(trigger);
    const $form = $trigger.closest('form.sm-form');

    if ($form.length) {
        return $form;
    }

    return $('.sm-questionnaire .sm-form').first();
}

function getCheckedAnswer($scope) {
    const $checked = $scope.find('[data-answer]:checked').first();

    if (!$checked.length) {
        return { value: '', label: '' };
    }

    return {
        value: $checked.val() || '',
        label: $.trim($checked.closest('label').text())
    };
}

function getCheckedDrinks($scope) {
    return $scope.find('input[name="alco[]"]:checked').map(function () {
        const text = $.trim($(this).closest('label').find('[data-sm-alcoitem]').text());
        return text || $(this).val();
    }).get();
}

function getExtraAnswers($scope) {
    const answers = {};

    $scope.find('[data-sm-anketa][data-forq]').each(function () {
        const qid = $(this).attr('data-forq');
        const $single = $scope.find('input[name="' + qid + '"]');
        const $multi = $scope.find('input[name="' + qid + '[]"]');

        if ($single.length) {
            if ($single.first().attr('type') === 'radio') {
                answers[qid] = $single.filter(':checked').val() || '';
            } else {
                answers[qid] = $.trim($single.first().val() || '');
            }
            return;
        }

        answers[qid] = $multi.filter(':checked').map(function () {
            return $(this).val();
        }).get();
    });

    return answers;
}

function getTransferAnswer($scope) {
    return $scope.find('[data-forq="transfer"] input[name="transfer"]:checked').val() || '';
}

function submitRsvpToGoogle(payload, endpoint) {
    let iframe = document.getElementById('sm-rsvp-target');

    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'sm-rsvp-target';
        iframe.name = 'sm-rsvp-target';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = endpoint;
    form.target = iframe.name;
    form.style.display = 'none';

    Object.keys(payload).forEach(function (key) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payload[key];
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    setTimeout(function () {
        form.remove();
    }, 1000);
}

let isSubmittingRsvp = false;

// Handle each form
forms.forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        openThankYouModal();
        form.reset(); // Reset the form
    });
});

$(document).on('click', '[data-sm-anketa-send]', function (event) {
    if ($(this).hasClass('open-modal')) {
        return true;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    if (isSubmittingRsvp) {
        return false;
    }

    const endpoint = getGoogleScriptUrl();
    if (!endpoint) {
        alert('Укажите URL Google Apps Script в site-config.js');
        return false;
    }

    const $scope = getFormScope(this);
    const name = $.trim($scope.find('[data-sm-anketa-name]').first().val() || '');
    const company = $.trim($scope.find('[data-sm-anketa-company]').first().val() || '');
    const answer = getCheckedAnswer($scope);
    const drinks = getCheckedDrinks($scope);
    const extraAnswers = getExtraAnswers($scope);
    const transfer = getTransferAnswer($scope);

    extraAnswers.transfer = transfer;

    if (!name) {
        alert('Пожалуйста, укажите имя и фамилию.');
        return false;
    }

    if (!answer.value) {
        alert('Пожалуйста, выберите ответ на вопрос о присутствии.');
        return false;
    }

    isSubmittingRsvp = true;

    submitRsvpToGoogle({
        projectId: $('body').attr('data-project-id') || '',
        guestName: name,
        guestCompany: company,
        attendanceValue: answer.label,
        drinks: drinks.join(', '),
        transfer: transfer,
        extraAnswers: JSON.stringify(extraAnswers),
        pageUrl: window.location.href,
        userAgent: window.navigator.userAgent
    }, endpoint);

    openThankYouModal();

    setTimeout(function () {
        isSubmittingRsvp = false;
    }, 3000);

    return false;
});

// Close the thank-you modal
const closeModalButton = document.getElementById('sm-modal-close');
if (closeModalButton && thankYouMessage) {
    closeModalButton.addEventListener('click', function() {
        thankYouMessage.classList.remove('active');
        thankYouMessage.classList.remove('sm-open'); // Remove sm-open
        body.classList.remove('sm-hidde'); // Remove sm-hidde from body
        $('.sm-quest-modal').removeClass('sm-open');
        $('body').removeClass('lock');
    });
}

CONFIG.debug.hooks = true;

Hooks.on('renderSidebarTab', (app, html, data) => {
  let $chat_form = html.find('#chat-form');
  const template = 'modules/wfrp3-dice-tray/templates/tray.html';
  const options = {
    dice: {
      characteristics: 'a',
      conservative: 'c',
      reckless: 'r',
      expertise: 'e',
      fortune: 'f',
      misfortune: 'm',
      challenge: 'x'
    },
  };

  renderTemplate(template, options).then(c => {
    if (c.length > 0) {
      let $content = $(c);
      $chat_form.after($content);
      $content.find('.wfrp3-dice-tray__button').on('click', event => {
        event.preventDefault();
        let dataset = event.currentTarget.dataset;

        let input = html.find('input[name="wfrp3.dice.tray."' + dataset.option + ']');
        let current = parseInt(input.val());
        if(current === NaN) {
          current = 0;
        }
        input.val(current + 1);
      });
      $content.find('.wfrp3-dice-tray__roll').on('click', event => {
        event.preventDefault();
        let spoofed = $.Event('keydown');
        spoofed.which = 13;
        spoofed.keycode = 13;
        spoofed.code = 'Enter';
        spoofed.key = 'Enter';
        let results = html.find('.wfrp3-dice-tray__input');
        let message = '/wfrp3 '
        results.each((i, e) => {
          let option = $(e).attr('name').replace('wfrp3.dice.tray.', '');
          let value = $(e).val();
          if(parseInt(value) > 0) {
            message += "" + value + options.dice[option];
          }
        });
        let $chat = html.find('#chat-form textarea');
        $chat.val(message);
        html.find('#chat-message').trigger(spoofed);
      });
      html.find('#chat-message').keydown(e => {
        if (e.code == 'Enter' || e.key == 'Enter' || e.keycode == '13') {
          html.find('.wfrp3-dice-tray__flag').text('');
          html.find('.wfrp3-dice-tray__flag').addClass('hide');
          html.find('.wfrp3-dice-tray__ad').removeClass('active');
        }
      });
    }
  });
});

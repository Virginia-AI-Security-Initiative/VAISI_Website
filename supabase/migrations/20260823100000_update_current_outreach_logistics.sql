update public.admin_emails
set body = replace(
  replace(
    replace(
      replace(
        replace(
          body,
          '<li><strong>Club Fair:</strong> Monday, August 24 from 11 AM–3 PM at <strong>table 59 on Peabody Lawn</strong>. <a href="https://www.instagram.com/p/DcR23nRiSpy/?igsh=MWEzZGVhMHE1NjN3Yw%3D%3D">Find us on the map.</a></li>',
          ''
        ),
        'There are three places you can find us next week:',
        'There are two places you can find us next week:'
      ),
      'Intro to AI Safety and AI Policy fellowships',
      '<a href="https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?tab=t.0">Intro to AI Safety</a> and <a href="https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?tab=t.uuornxg83lhk">AI Policy</a> fellowships'
    ),
    'Intro to AI Safety Fellowship',
    '<a href="https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?tab=t.0">Intro to AI Safety Fellowship</a>'
  ),
  'AI Policy Fellowship',
  '<a href="https://docs.google.com/document/d/10HcHGxPJ5VpnWoK1sq2nQQ6N85vsy95vgF_T9XGw3Es/edit?tab=t.uuornxg83lhk">AI Policy Fellowship</a>'
)
where status = 'draft'
  and distribution_context = 'external_list'
  and (
    body like '%Club Fair%'
    or body like '%There are three places you can find us%'
    or (
      body like '%Intro to AI Safety Fellowship%'
      and body not like '%edit?tab=t.0%'
    )
    or (
      body like '%AI Policy Fellowship%'
      and body not like '%edit?tab=t.uuornxg83lhk%'
    )
    or (
      body like '%Intro to AI Safety and AI Policy fellowships%'
      and body not like '%edit?tab=t.0%'
      and body not like '%edit?tab=t.uuornxg83lhk%'
    )
  );

update public.admin_emails
set body = replace(
  body,
  'There are three places you can find us next week to learn more:',
  'There are two places you can find us next week to learn more:'
)
where status = 'draft'
  and distribution_context = 'external_list'
  and body like '%There are three places you can find us next week to learn more:%';

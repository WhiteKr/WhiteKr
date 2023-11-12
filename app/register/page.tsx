const Register = () => (
  <div className='page-container'>
    <form method='POST' action='/api/auth/signup'>
      <input name='name' type='text' placeholder='이름' />
      <input name='email' type='text' placeholder='이메일' />
      <input name='password' type='password' placeholder='비번' />
      <button type='submit'>회원가입</button>
    </form>
  </div>
);

export default Register;

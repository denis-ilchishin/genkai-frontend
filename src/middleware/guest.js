export default ({ redirect, $auth }) => {
  if ($auth.loggedIn) {
    redirect({ name: 'account' })
  }
}

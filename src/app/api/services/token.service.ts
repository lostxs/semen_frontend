import Cookies from 'js-cookie';

export const getAccessToken = () => {
	const accessToken = Cookies.get('session');

	return accessToken || null;
};

export const saveAccessToken = (accessToken: string) => {
	Cookies.set('session', accessToken, {
		sameSite: 'lax',
		secure: false,
		httpOnly: true
	});
};

export const removeAccessToken = () => {
	Cookies.remove('session');
};

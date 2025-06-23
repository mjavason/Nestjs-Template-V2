const avatarStyles: string[] = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'avataaars-neutral',
  'big-ears',
  'big-ears-neutral',
  'big-smile',
  'bottts',
  'bottts-neutral',
  'croodles',
  'croodles-neutral',
  'fun-emoji',
  'icons',
  'identicon',
  'initials',
  'lorelei',
  'lorelei-neutral',
  'micah',
  'miniavs',
  'open-peeps',
  'personas',
  'pixel-art',
  'pixel-art-neutral',
  'shapes',
  'thumbs',
];

const getRandomAvatarStyle = (): string => {
  const random = Math.floor(Math.random() * avatarStyles.length);
  return avatarStyles[random];
};

function generateRandomAvatar(email: string): string {
  const _email = email.trim();

  const randomString = (): string => Math.random().toString(36).substring(2, 7);

  const replaceAt = `-${randomString()}-`;
  const replaceDot = `-${randomString()}-`;

  const seed = _email.replace('@', replaceAt).replace(/\./g, replaceDot);

  const randomAvatarStyle = getRandomAvatarStyle();

  const avatarUrl = `https://api.dicebear.com/5.x/${randomAvatarStyle}/svg?seed=${seed}&size=200&radius=50`;

  return avatarUrl;
}

export { generateRandomAvatar };

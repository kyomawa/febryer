type Attempt = {
  count: number;
  lastAttempt: number;
};

const loginAttempts: Record<string, Attempt> = {};

export const checkRateLimit = (ip: string, attempts?: number): boolean => {
  const currentTime = Date.now();
  const limit = process.env.NODE_ENV === "production" ? attempts || 5 : 1000000; // Maximum attempts
  const windowTime = 60 * 1000 * 10; // 10 mins

  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 1, lastAttempt: currentTime };
    return true;
  }

  const attempt = loginAttempts[ip];

  if (currentTime - attempt.lastAttempt < windowTime) {
    attempt.count += 1;
  } else {
    attempt.count = 1;
    attempt.lastAttempt = currentTime;
  }

  if (attempt.count > limit) {
    return false;
  }

  return true;
};

export const resetRateLimit = (ip: string) => {
  delete loginAttempts[ip];
};

export const getIp = async (): Promise<string> => {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
};

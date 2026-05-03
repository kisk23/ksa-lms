import type { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'أحمد خالد',
    email: 'ahmed.k@example.com',
    role: 'student',
    registeredAt: '15 أكتوبر 2023',
    status: 'active',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCobpZ4Kj_Pxs2b5HWO2PmdRnQTe_MudQnCb4AAJgZyMyDevgcPehy5dirsdrmP0clTqghzAJfCWBN0TCzT3oF-cGSSVVbilVoIjhqNFl5lemrXC885mWZpN62t5tQj_uuCQmuKsDo1lN3GgG1p4CcBGI0_bSUzh3upouShYjYQ5jXkh397buCmWmiViUybgx84PKL1MSSnC0FW8n9RleQUczQUzJKYPsBmzlmx_MxC47pbV-7V0MlKhhArIasZIiTjqJ9WBfBKRxbF',
  },
  {
    id: '2',
    name: 'سارة محمد',
    email: 'sara.m@edu.sa',
    role: 'teacher',
    registeredAt: '12 أكتوبر 2023',
    status: 'active',
  },
  {
    id: '3',
    name: 'فاطمة علي',
    email: 'fatima.a@gmail.com',
    role: 'parent',
    registeredAt: '10 أكتوبر 2023',
    status: 'pending',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA10MDMiC-Ff4A_TavvBLalV5_VYMyR9yrvxfmabywOmcYofOzrhFEfrF_g074TYuT7mnnNHD3a9fJAehhEe3uIxTJ1s-cdM7ET0UfND6b1u5E5TWaOMs3Vp6liow1iwDcm1RJzqrBo9rLVGHM10heDYYszR2SaWEtPLDl2FQGTmJSd9g09KmfX_XIkCG9TsEFzTZaNIxdeqnvRS-ET6oNycapcm5KVyiQBS3HEWbIa70im2yGgEEGiHONu7-VOVpKEnEof12dt8_ua',
  },
  {
    id: '4',
    name: 'يوسف إبراهيم',
    email: 'yousef.i@example.com',
    role: 'student',
    registeredAt: '05 أكتوبر 2023',
    status: 'blocked',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCib9dFkLeVTXQdEE3ZRrLKf7ju_E161v4NVOUNtxEMXhQAXChIkJ4g0x2M6cn14-46Yw4tDaQQHcptOa1e3sOzJ17zIXhSVBC6z6y0GnjSKbjvYs92DBK-QvHGwsaku2jGooUZFjoFQbeazG50tP881oPwt4jftxg9DKugpdrS5_AeOOoFaLP9xXL4N2c_wvazZE8TnFpNWmWMKnd9vo33ie6UCuaJxz8RwsSAelX_IbJKgmL8bcON6AjP8daLpRMZRIRXdtKMIM6m',
  },
];

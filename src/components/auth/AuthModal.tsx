import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { Modal } from '../ui/Modal';
import { User, Building2, Briefcase, ArrowLeft, Eye, EyeOff, Upload, Check } from 'lucide-react';

type Step = 'role' | 'auth' | 'kyc' | 'success';
type AuthMode = 'login' | 'register';
type UserRole = 'customer' | 'sale' | 'owner';

const roleOptions = [
  {
    value: 'customer' as UserRole,
    label: 'Tôi là Khách hàng',
    description: 'Tìm phòng trọ, đặt lịch xem phòng',
    icon: User,
  },
  {
    value: 'sale' as UserRole,
    label: 'Tôi là Sale',
    description: 'Quản lý khách hàng, nhận hoa hồng',
    icon: Briefcase,
  },
  {
    value: 'owner' as UserRole,
    label: 'Tôi là Chủ nhà',
    description: 'Quản lý tòa nhà, phòng trọ, duyệt cọc',
    icon: Building2,
  },
];

export function AuthModal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();

  const mode = searchParams.get('mode') as AuthMode || 'login';
  const isOpen = searchParams.get('auth') === 'true';

  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isRegister, setIsRegister] = useState(mode === 'register');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [kycStep, setKycStep] = useState(1);
  const [kycFiles, setKycFiles] = useState({
    cccdFront: null as File | null,
    cccdBack: null as File | null,
    facePhoto: null as File | null,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    navigate(-1);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('auth');
  };

  const handleAuthFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const validateAuthForm = () => {
    const newErrors: string[] = [];
    if (!formData.email) newErrors.push('Vui lòng nhập email');
    if (!formData.password) newErrors.push('Vui lòng nhập mật khẩu');
    if (isRegister) {
      if (!formData.fullName) newErrors.push('Vui lòng nhập họ tên');
      if (formData.password.length < 6) newErrors.push('Mật khẩu phải có ít nhất 6 ký tự');
      if (formData.password !== formData.confirmPassword) newErrors.push('Mật khẩu không khớp');
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAuthForm()) return;

    setIsLoading(true);
    setErrors([]);

    try {
      if (isRegister) {
        const { error } = await signUp(formData.email, formData.password, selectedRole!, formData.fullName);
        if (error) {
          setErrors([error.message]);
          return;
        }

        // Nếu là sale hoặc owner, cần KYC
        if (selectedRole === 'sale' || selectedRole === 'owner') {
          setStep('kyc');
        } else {
          setStep('success');
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setErrors([error.message]);
          return;
        }
        handleClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKycFileChange = (field: keyof typeof kycFiles, file: File | null) => {
    setKycFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleKycNext = () => {
    if (kycStep < 3) {
      setKycStep(kycStep + 1);
    } else {
      // Submit KYC (placeholder - in real app, upload to storage)
      setStep('success');
    }
  };

  const goToRoleSelection = () => {
    setStep('role');
    setSelectedRole(null);
    setErrors([]);
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setErrors([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      {step === 'role' && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            Chọn vai trò của bạn
          </h2>
          <div className="space-y-3">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handleRoleSelect(option.value)}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-left flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6 text-gray-600 group-hover:text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 'auth' && (
        <div className="animate-fade-in">
          <button
            onClick={goToRoleSelection}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại chọn vai trò
          </button>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
          </h2>

          {selectedRole && (
            <p className="text-sm text-gray-500 mb-4">
              Đăng ký với vai trò:{' '}
              <span className="font-medium text-primary-600">
                {roleOptions.find((r) => r.value === selectedRole)?.label}
              </span>
            </p>
          )}

          {errors.length > 0 && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3 mb-4">
              {errors.map((error, i) => (
                <p key={i} className="text-sm text-error-600">
                  {error}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="label">Họ tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleAuthFormChange('fullName', e.target.value)}
                  className="input"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleAuthFormChange('email', e.target.value)}
                className="input"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="label">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleAuthFormChange('password', e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="label">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleAuthFormChange('confirmPassword', e.target.value)}
                  className="input"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : isRegister ? (
                'Tạo tài khoản'
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
              <button
                onClick={toggleMode}
                className="text-primary-600 font-medium hover:underline"
              >
                {isRegister ? 'Đăng nhập' : 'Đăng ký ngay'}
              </button>
            </p>
          </div>
        </div>
      )}

      {step === 'kyc' && (
        <div className="animate-fade-in">
          <button
            onClick={goToRoleSelection}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">Xác thực danh tính</h2>
          <p className="text-sm text-gray-500 mb-6">
            Vui lòng tải lên CCCD để xác thực tài khoản Sale/Owner
          </p>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    kycStep >= i
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {kycStep > i ? <Check className="w-4 h-4" /> : i}
                </div>
                {i < 3 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      kycStep > i ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* KYC Steps */}
          {kycStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Mặt trước CCCD</p>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleKycFileChange('cccdFront', e.target.files?.[0] || null)}
                  className="hidden"
                  id="cccd-front"
                />
                <label htmlFor="cccd-front" className="cursor-pointer">
                  {kycFiles.cccdFront ? (
                    <div className="text-success-600">
                      <Check className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-medium">{kycFiles.cccdFront.name}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Kéo thả hoặc nhấn để tải lên
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG tối đa 10MB
                      </p>
                    </>
                  )}
                </label>
              </div>
              <button
                onClick={handleKycNext}
                disabled={!kycFiles.cccdFront}
                className="btn-primary w-full"
              >
                Tiếp tục
              </button>
            </div>
          )}

          {kycStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Mặt sau CCCD</p>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleKycFileChange('cccdBack', e.target.files?.[0] || null)}
                  className="hidden"
                  id="cccd-back"
                />
                <label htmlFor="cccd-back" className="cursor-pointer">
                  {kycFiles.cccdBack ? (
                    <div className="text-success-600">
                      <Check className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-medium">{kycFiles.cccdBack.name}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Kéo thả hoặc nhấn để tải lên
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG tối đa 10MB
                      </p>
                    </>
                  )}
                </label>
              </div>
              <button
                onClick={handleKycNext}
                disabled={!kycFiles.cccdBack}
                className="btn-primary w-full"
              >
                Tiếp tục
              </button>
            </div>
          )}

          {kycStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Xác thực khuôn mặt</p>
              <p className="text-xs text-gray-500 mb-2">
                Chụp ảnh selfie để xác thực
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleKycFileChange('facePhoto', e.target.files?.[0] || null)}
                  className="hidden"
                  id="face-photo"
                />
                <label htmlFor="face-photo" className="cursor-pointer">
                  {kycFiles.facePhoto ? (
                    <div className="text-success-600">
                      <Check className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-medium">{kycFiles.facePhoto.name}</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Kéo thả hoặc nhấn để tải lên
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG tối đa 10MB
                      </p>
                    </>
                  )}
                </label>
              </div>
              <button
                onClick={handleKycNext}
                disabled={!kycFiles.facePhoto}
                className="btn-primary w-full"
              >
                Hoàn tất
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-8 animate-fade-in">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Đăng ký thành công!
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Tài khoản của bạn đã được tạo thành công.
            {selectedRole !== 'customer' && (
              <span className="block mt-1">
                Yêu cầu xác thực đang được xử lý.
              </span>
            )}
          </p>
          <button onClick={handleClose} className="btn-primary">
            Đi đến Trang chủ
          </button>
        </div>
      )}
    </Modal>
  );
}

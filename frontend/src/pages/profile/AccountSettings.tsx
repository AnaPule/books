import { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { Modal } from '@components/skeleton/modal';
import { Camera, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { request } from '@utils/ApiRequest';
import { type FormEvent } from 'react';
interface AccountSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AccountSettings: React.FC<AccountSettingsModalProps> = ({ isOpen, onClose }) => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: user?.id || '',
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        cellphone: user?.cellphone || '',
        profilePhoto: user?.profilePhoto || '',
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        //console.log(formData)

        await request.put(`/auth/${user?.id}`, formData)
            .then(
                (res: any) => {
                    toast.info('Account Settings', {
                        description: res.message
                    });
                    setUser(res.user)
                }
            ).catch(
                (error: any) => {
                    toast.warning('Account Settings', {
                        description: error.message
                    })
                }
            ).finally(
                () => {
                    setLoading(false);
                    onClose();
                }
            )
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Account Settings">
            <form
                onSubmit={(e:FormEvent) => handleSubmit(e)}
                className="space-y-5">
                {/* Profile Photo */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={formData.profilePhoto || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300"}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border-2 border-[#e8bfb0]"
                        />
                        <button
                            type="button"
                            className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#8d6c45] rounded-full flex items-center justify-center text-white border border-[#fcf9f4] hover:bg-[#5a4d41] transition"
                        >
                            <Camera size={12} />
                        </button>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-[#7e6957] mb-1">Profile Photo</p>
                        <input
                            type="text"
                            value={formData.profilePhoto}
                            onChange={(e) => handleChange('profilePhoto', e.target.value)}
                            placeholder="Image URL"
                            className="w-full text-sm bg-[#f5e6d7]/30 border border-[#e8bfb0] rounded-lg px-3 py-2 text-[#5a4d41] placeholder-[#b8a58f] focus:outline-none focus:border-[#8d6c45]"
                        />
                    </div>
                </div>

                {/* Username */}
                <div>
                    <label className="block text-xs text-[#7e6957] mb-1">Username</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        className="w-full text-sm bg-[#f5e6d7]/30 border border-[#e8bfb0] rounded-lg px-4 py-2.5 text-[#5a4d41] placeholder-[#b8a58f] focus:outline-none focus:border-[#8d6c45]"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs text-[#7e6957] mb-1">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full text-sm bg-[#f5e6d7]/30 border border-[#e8bfb0] rounded-lg px-4 py-2.5 text-[#5a4d41] placeholder-[#b8a58f] focus:outline-none focus:border-[#8d6c45]"
                        required
                    />
                </div>

                {/* Cellphone */}
                <div>
                    <label className="block text-xs text-[#7e6957] mb-1">Cellphone</label>
                    <input
                        type="tel"
                        value={formData.cellphone}
                        onChange={(e) => handleChange('cellphone', e.target.value)}
                        className="w-full text-sm bg-[#f5e6d7]/30 border border-[#e8bfb0] rounded-lg px-4 py-2.5 text-[#5a4d41] placeholder-[#b8a58f] focus:outline-none focus:border-[#8d6c45]"
                    />
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-xs text-[#7e6957] mb-1">Bio</label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        rows={3}
                        className="w-full text-sm bg-[#f5e6d7]/30 border border-[#e8bfb0] rounded-lg px-4 py-2.5 text-[#5a4d41] placeholder-[#b8a58f] focus:outline-none focus:border-[#8d6c45] resize-none"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#8d6c45] to-[#a68569] text-white text-sm rounded-lg hover:from-[#5a4d41] hover:to-[#7e6957] transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save size={16} />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-[#e8bfb0] text-[#5a4d41] text-sm rounded-lg hover:bg-[#f5e6d7] transition flex items-center justify-center gap-2"
                    >
                        <X size={16} />
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
};
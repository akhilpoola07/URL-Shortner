import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Link as LinkIcon, PlusCircle, BarChart3, Settings } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
        { path: '/dashboard/links', label: 'My Links', icon: LinkIcon },
        { path: '/dashboard/create', label: 'Create Short URL', icon: PlusCircle },
        { path: '/dashboard/settings', label: 'Profile & Settings', icon: Settings },
    ];

    return (
        <aside className="sidebar">
            <ul className="sidebar-menu">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    LinkShort v1.0.0 &copy; {new Date().getFullYear()}
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;

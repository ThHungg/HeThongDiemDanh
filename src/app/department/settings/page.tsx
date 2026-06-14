"use client";
import { memo } from "react";
import ContentHeader from "src/components/Common/ContentHeader";
import MailConfigManager from "src/components/Department/Settings/MailConfigManager";
import SemesterManager from "src/components/Department/Settings/SemesterManager";

const SettingPage = () => {
  return (
    <div className="p-[24px]">
      <ContentHeader
        title="Cấu hình"
        showExport={false}
        onExport={() => {}}
        addLabel="Thêm lớp học"
        showAdd={false}
        onAdd={() => {}}
      />
      <MailConfigManager />
      <SemesterManager />
    </div>
  );
};

export default memo(SettingPage);

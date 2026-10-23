import Button from "../../common/components/Button";
import './WritePostPage.css';

type WritePostPageProps = {
    onClose: () => void;
};

function WritePostPage({onClose}: WritePostPageProps) {
    return (
        <Button
                className='community-back'
                onClick={onClose}
            >
            목록으로
        </Button>
    )
}

export default WritePostPage;